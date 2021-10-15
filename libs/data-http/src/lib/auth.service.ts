import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http: HttpClient;

  private readonly redirectUri = 'http://localhost:4200';
  private readonly clientId = 'web-spa';
  private readonly authUrl = 'http://localhost:8095/auth/realms/hello-spring/protocol/openid-connect/auth';
  private readonly tokenUri = 'http://localhost:8095/auth/realms/hello-spring/protocol/openid-connect/token';
  private readonly scopes = 'profile offline_access read write';

  private readonly TOKEN_KEY = 'hsc_token';
  private readonly REFRESH_TOKEN_KEY = 'hsc_refresh_token';
  private readonly FIRST_REFRESH_TOKEN_KEY = 'hsc_frt';

  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  genAuthUrl(): string {
    const queryParamsObject = {
      client_id: this.clientId,
      response_type: 'code',
      scope: this.scopes,
      redirect_uri: this.redirectUri
    };
    const params = new URLSearchParams();
    Object.entries(queryParamsObject).forEach(([key, value]) => params.append(key, value));
    return `${this.authUrl}?${params.toString()}`;
  }

  requestAccessToken(code: string): Observable<any> {
    const body = new HttpParams()
      .append('grant_type', 'authorization_code')
      .append('redirect_uri', this.redirectUri)
      .append('code', code)
      .append('client_id', this.clientId);

    const headers = {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    };

    return this.http.post<any>(this.tokenUri, body, {headers});
  }

  requestRefreshToken(): Observable<any> {
    const body = new HttpParams()
      .append('grant_type', 'refresh_token')
      .append('refresh_token', this.getRefreshToken())
      .append('client_id', this.clientId);

    const headers = {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    };

    return this.http.post<any>(this.tokenUri, body, {headers});
  }

  isHasToken(): boolean {
    return this.getCookie(this.TOKEN_KEY) != '';
  }

  isHasRefreshToken(): boolean {
    return this.getCookie(this.REFRESH_TOKEN_KEY) != '';
  }

  getToken(): string {
    return this.getCookie(this.TOKEN_KEY);
  }

  getRefreshToken(): string {
    return this.getCookie(this.REFRESH_TOKEN_KEY);
  }

  /**
   * @param token: access token
   * @param expireIn: time expire of token, use second unit
   */
  setToken(token: string, expireIn: number): void {
    this.deleteCookie(this.TOKEN_KEY);
    const dateExpire = new Date();
    dateExpire.setTime(dateExpire.getTime() + (expireIn * 1000));
    // set first refresh token 80 percent live time of access token
    const timeRefreshToken = dateExpire.getTime() - (0.2 * expireIn * 1000);
    localStorage.setItem(this.FIRST_REFRESH_TOKEN_KEY, timeRefreshToken.toString());
    // set access token
    this.setCookie(this.TOKEN_KEY, token, dateExpire);
  }

  getFirstTimeRefreshToken(): number {
    const now = new Date();
    const dateStr = localStorage.getItem(this.FIRST_REFRESH_TOKEN_KEY);
    if (dateStr) {
      return Number(dateStr) - now.getTime();
    }
    return 0;
  }

  /**
   * @param token: access token
   * @param expireIn: time expire of token, use second unit
   */
  setRefreshToken(token: string, expireIn: number): void {
    this.deleteCookie(this.REFRESH_TOKEN_KEY);
    const dateExpire = new Date();
    dateExpire.setTime(dateExpire.getTime() + (expireIn * 1000));
    this.setCookie(this.REFRESH_TOKEN_KEY, token, dateExpire);
  }

  setCookie(cName: string, cValue: any, expireDate: Date): void {
    const expires = 'expires=' + expireDate.toUTCString();
    document.cookie = cName + '=' + cValue + ';' + expires + ';path=/';
  }

  getCookie(cName: string): string {
    const name = cName + '=';
    const ca = document.cookie.split(';');
    for (let c of ca) {
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  deleteCookie(cName: string): void {
    const cValue = this.getCookie(cName);
    if (cValue !== '') {
      document.cookie = cName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }
}
