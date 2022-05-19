import {Injectable} from '@angular/core';
import {ComponentStore, tapResponse} from '@ngrx/component-store';
import {ActivatedRoute, Router} from '@angular/router';
import {concatMap, filter, finalize, switchMap, switchMapTo, take, takeUntil, tap} from 'rxjs/operators';
import {EMPTY, iif, Observable, Subject, timer} from 'rxjs';
import {AuthService, TokenResponse} from "@hello-spring-client/data-http";
import {LogoutRequest, ProfileService} from "@hello-spring-client/data-generated";

export interface AuthState {
  tokenReceived: string;
  loggedIn: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthStore extends ComponentStore<AuthState> {
  logoutSubject: Subject<unknown> = new Subject<unknown>();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private profileService: ProfileService
  ) {
    super(<AuthState>{
      loggedIn: false
    });
  }

  readonly tokenReceived$ = this.select((state) => state.tokenReceived);
  readonly loggedIn$ = this.select((state) => state.loggedIn);

  readonly login = this.effect((trigger$) => trigger$.pipe(
    switchMapTo(
      iif(
        () => this.authService.isHasRefreshToken(),
        this.timerRefreshToken(true),
        this.route.queryParams.pipe(
          take(1),
          tap((params) => {
            if (params['error']) {
              console.error(params['error'], params['error_description']);
            } else if (!params['code']) {
              window.location.href = this.authService.genAuthUrl();
            }
          }),
          filter((params) => !!params['code']),
          concatMap((params) => this.authService.requestAccessToken(params['code']).pipe(
            tapResponse((res) => {
              this.logInSuccess(res);
              void this.router.navigate([]); // reload
            }, console.error),
            concatMap(() => this.timerRefreshToken())
          ))
        ) // request token and set to cookie in first time access page
      )
    )
  ));

  readonly logout = this.effect((request$: Observable<LogoutRequest>) => request$.pipe(
    switchMap((request) => this.profileService.postUserLogout(request).pipe(
      finalize(() => {
        this.logoutSubject.next();
        this.logoutSubject.complete();
        this.authService.clearToken();
        this.patchState({loggedIn: false});
        void this.router.navigate(['']);
      })
    )),
  ));

  private timerRefreshToken(immediate?: boolean): Observable<TokenResponse> {
    return iif(() => this.authService.isHasRefreshToken(),
      timer(immediate ? 0 : this.authService.getFirstTimeRefreshToken(), 180000).pipe(
        takeUntil(this.logoutSubject),
        switchMap(() => this.authService.requestRefreshToken().pipe(
          tapResponse((res) => this.logInSuccess(res), err => {
            console.error(err);
            this.authService.clearToken();
          })
        ))
      ), EMPTY);
  }

  private logInSuccess(res: TokenResponse) {
    this.authService.setToken(res.access_token, res.expires_in);
    this.authService.setRefreshToken(res.refresh_token, 1800);
    this.patchState({tokenReceived: res.access_token, loggedIn: true});
  }

}
