import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {enc, SHA256} from 'crypto-js';

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
  private readonly CODE_VERIFIER_KEY = 'hsc_code_verifier';
  private readonly isPKCESupport = false;
  private readonly codeChallengeMethod = 'S256';

  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  genAuthUrl() {
    let queryParamsObject: {[key: string]: string} = {
      client_id: this.clientId,
      response_type: 'code',
      scope: this.scopes,
      redirect_uri: this.redirectUri
    };
    if (this.isPKCESupport) {
      const now = new Date();
      const stateValue = this.generateState();
      const codeVerifier = this.generateCodeVerifier();
      const codeChallenge = this.generateCodeChallenge(codeVerifier);
      this.setCookie(this.CODE_VERIFIER_KEY, codeVerifier, new Date(now.getTime() + 12000));
      queryParamsObject = {
        ...queryParamsObject,
        state: stateValue,
        code_challenge_method: this.codeChallengeMethod,
        code_challenge: codeChallenge
      }
    }
    const params = new URLSearchParams();
    Object.entries(queryParamsObject).forEach(([key, value]) => params.append(key, value));
    return `${this.authUrl}?${params.toString()}`;
  }

  requestAccessToken(code: string): Observable<any> {
    let body = new HttpParams()
      .append('grant_type', 'authorization_code')
      .append('redirect_uri', this.redirectUri)
      .append('code', code)
      .append('client_id', this.clientId);
    if (this.isPKCESupport) {
      body = body.append('code_verifier', this.getCookie(this.CODE_VERIFIER_KEY));
    }

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

  private generateCodeChallenge(codeVerifier: string): string {
    const hashBuffer = SHA256(codeVerifier).toString(enc.Base64);
    return hashBuffer
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private generateCodeVerifier(): string {
    const randomByteArray = new Uint8Array(32);
    window.crypto.getRandomValues(randomByteArray);
    return this.base64UrlEncode(randomByteArray);
  };

  private generateState(): string {
    return this.randomString(48);
  };

  private randomString(len: number): string {
    const arr = new Uint8Array(len);
    window.crypto.getRandomValues(arr);
    const str = this.base64UrlEncode(arr);
    return str.substring(0, len);
  }

  private base64UrlEncode(byteArray: any): string {
    const stringCode = String.fromCharCode.apply(null, byteArray);
    const base64Encoded = btoa(stringCode);
    return base64Encoded
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };
}
