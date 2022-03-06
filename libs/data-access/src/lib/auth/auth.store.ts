import {Injectable} from '@angular/core';
import {ComponentStore, tapResponse} from '@ngrx/component-store';
import {ActivatedRoute, Router} from '@angular/router';
import {concatMap, filter, switchMap, switchMapTo, take, tap} from 'rxjs/operators';
import {EMPTY, iif, merge, Observable, of, timer} from 'rxjs';
import {AuthService, TokenResponse} from "@hello-spring-client/data-http";

export interface AuthState {
  tokenReceived: string;
  loggedIn: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthStore extends ComponentStore<AuthState> {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    super(<AuthState>{
      loggedIn: false
    });
  }

  readonly tokenReceived$ = this.select((state) => state.tokenReceived);

  readonly login = this.effect((trigger$) => trigger$.pipe(
    switchMapTo(
      iif(
        () => this.authService.isHasToken(),
        merge(
          of('').pipe(
            take(1), // one time
            tap(() => this.patchState({
              tokenReceived: this.authService.getToken(),
              loggedIn: true
            })) // notify user logged in by tokenReceived state
          ),
          this.timerRefreshToken() // call refresh token before access token expire, every 180000ms = 3minutes
        ),
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
              this.authService.setToken(res.access_token, res.expires_in); // save token to local storage
              this.authService.setRefreshToken(res.refresh_token, 1800); // save refresh token to local storage
              this.patchState({tokenReceived: res.access_token});
              void this.router.navigate([]); // reload
            }, console.error),
            concatMap(() => this.timerRefreshToken())
          ))
        ) // request token and set to cookie in first time access page
      )
    )
  ));

  private timerRefreshToken(): Observable<TokenResponse> {
    return iif(() => this.authService.isHasRefreshToken(),
      timer(this.authService.getFirstTimeRefreshToken(), 180000).pipe(
        switchMap(() => this.authService.requestRefreshToken().pipe(
          tap((res) => {
            this.patchState({tokenReceived: res.access_token});
            this.authService.setToken(res.access_token, res.expires_in);
            this.authService.setRefreshToken(res.refresh_token, 1800);
          })
        ))
      ), EMPTY);
  }

}
