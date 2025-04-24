import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, mapTo, Observable, tap } from 'rxjs';
import { UserDetails } from './auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUri: string = 'http://192.168.0.179:5081';
  private readonly client: HttpClient;
  private loggedIn = new BehaviorSubject<boolean>(this.tokenExists());

  public loggedIn$ = this.loggedIn.asObservable();

  public constructor(client: HttpClient) {
    this.client = client;
  }

  private tokenExists(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  public getUserDetails(): Observable<UserDetails> {
    return this.client.get<UserDetails>(`${this.baseUri}/users/details`);
  }

  public login(): Observable<boolean> {
    return this.client
      .post<AuthResponse>(`${this.baseUri}/auth/login`, {
        email: 'user@example.com',
        password: 'string12',
      })
      .pipe(
        tap((res) => {
          if (res.isSuccess) {
            localStorage.setItem('accessToken', res.accessToken as string);
            localStorage.setItem('refreshToken', res.refreshToken as string);
          } else {
            console.error(res.message);
          }
        }),
        map((res) => res.isSuccess)
      );
  }

  public refreshToken(): Observable<boolean> {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');
    return this.client
      .post<AuthResponse>(`${this.baseUri}/auth/refresh_token`, {
        refreshToken: refreshToken,
        accessToken: accessToken,
      })
      .pipe(
        tap((res) => {
          if (res.isSuccess) {
            localStorage.setItem('accessToken', res.accessToken as string);
            localStorage.setItem('refreshToken', res.refreshToken as string);
          } else {
            console.error(res.message);
          }
        }),
        map((res) => res.isSuccess)
      );
  }

  public register(): Observable<boolean> {
    return this.client
      .post(`${this.baseUri}/auth/register`, {
        firstName: 'Ihor',
        lastName: 'Reva',
        credentials: { email: 'ihor.reva@mail.com', password: 'password' },
      })
      .pipe(map((res) => true));
  }
}

export interface AuthResponse {
  isSuccess: boolean;
  message: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}
