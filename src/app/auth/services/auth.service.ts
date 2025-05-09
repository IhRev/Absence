import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, flatMap, map, mapTo, Observable, tap } from 'rxjs';
import {
  RegisterDTO,
  UserCredentials,
  UserDetails,
} from '../models/auth.models';

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

  public login(credentials: UserCredentials): Observable<boolean> {
    return this.client
      .post<AuthResponse>(`${this.baseUri}/auth/login`, credentials)
      .pipe(
        tap((res) => {
          if (res.isSuccess) {
            localStorage.setItem('accessToken', res.accessToken as string);
            localStorage.setItem('refreshToken', res.refreshToken as string);
            this.loggedIn.next(true);
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

  public register(registerDTO: RegisterDTO): Observable<boolean> {
    return this.client
      .post(`${this.baseUri}/auth/register`, registerDTO)
      .pipe(map((res) => true));
  }

  public logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.loggedIn.next(false);
  }
}

export interface AuthResponse {
  isSuccess: boolean;
  message: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}
