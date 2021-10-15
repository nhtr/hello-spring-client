import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, filter, switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { iif, merge, Observable, of, timer } from 'rxjs';
import { AuthService } from "@hello-spring-client/data-http";

export interface AuthState {
  tokenReceived: string;
}

@Injectable({ providedIn: 'root' })
export class AuthStore extends ComponentStore<AuthState>{

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    super(<AuthState>{});
  }

  readonly tokenReceived$ = this.select((state) => state.tokenReceived);

  readonly login = this.effect((trigger$) => trigger$.pipe(
    switchMapTo(
      iif(
        () => this.authService.isHasToken(),
        merge(
          of('').pipe(
            take(1), // one time
            tap(() => this.patchState({tokenReceived: this.authService.getToken()})) // notify user logged in by tokenReceived state
          ),
          this.timerRefreshToken() // call refresh token before access token expire, every 180000ms = 3minutes
        ),
        this.route.queryParams.pipe(
          take(1),
          tap((params) => {
            if (!params['code']) {
              window.location.href = this.authService.genAuthUrl();
            }
          }),
          filter((params) => !!params['code']),
          concatMap((params) => this.authService.requestAccessToken(params['code']).pipe(
            tapResponse((res: any) => {
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

  private timerRefreshToken(): Observable<any> {
    return timer(this.authService.getFirstTimeRefreshToken(), 180000).pipe(
      switchMap(() => this.authService.requestRefreshToken().pipe(
        tap((res: any) => {
          this.patchState({tokenReceived: res.access_token});
          this.authService.setToken(res.access_token, res.expires_in);
          this.authService.setRefreshToken(res.refresh_token, 1800);
        })
      ))
    );
  }

}
