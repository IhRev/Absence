import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import {
  AuthResponse,
  ChangePasswordRequest,
  DeleteUserRequest,
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

  // user
  public getUserDetails(): Observable<UserDetails | null> {
    return this.client
      .get<UserDetails>(`${this.baseUri}/users/details`, {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.status === 200) {
            return res.body;
          }
          return null;
        }),
        catchError((error) => {
          console.error(error);
          return of(null);
        })
      );
  }

  public updateUserDetails(userDetails: UserDetails): Observable<boolean> {
    return this.client
      .put(`${this.baseUri}/users/details`, userDetails, {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.status === 200) {
            return true;
          }
          return false;
        }),
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      );
  }

  public changePassword(request: ChangePasswordRequest): Observable<boolean> {
    return this.client
      .put(`${this.baseUri}/users/change_password`, request, {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.status === 200) {
            this.userLogedOut();
            return true;
          }
          return false;
        }),
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      );
  }

  public deleteProfile(password: string): Observable<boolean> {
    return this.client
      .delete(`${this.baseUri}/users`, {
        body: new DeleteUserRequest(password),
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.status === 200) {
            this.userLogedOut();
            return true;
          }
          return false;
        }),
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      );
  }

  // auth
  public login(credentials: UserCredentials): Observable<boolean> {
    return this.client
      .post<AuthResponse>(`${this.baseUri}/auth/login`, credentials, {
        observe: 'response',
      })
      .pipe(
        map((res) => {
          if (res.status == 200) {
            const body = res.body!;
            if (body.isSuccess) {
              localStorage.setItem('accessToken', body.accessToken as string);
              localStorage.setItem('refreshToken', body.refreshToken as string);
              this.loggedIn.next(true);
              return true;
            }
            console.error(body.message);
          }
          return false;
        }),
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      );
  }

  public refreshToken(): Observable<boolean> {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');
    return this.client
      .post<AuthResponse>(
        `${this.baseUri}/auth/refresh_token`,
        {
          refreshToken: refreshToken,
          accessToken: accessToken,
        },
        { observe: 'response' }
      )
      .pipe(
        map((res) => {
          if (res.status == 200) {
            const body = res.body!;
            if (body.isSuccess) {
              localStorage.setItem('accessToken', body.accessToken!);
              localStorage.setItem('refreshToken', body.refreshToken!);
              return true;
            }
            console.error(body.message);
          }
          return false;
        }),
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      );
  }

  public register(registerDTO: RegisterDTO): Observable<boolean> {
    return this.client
      .post<any>(`${this.baseUri}/auth/register`, registerDTO, {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res.status === 200;
        }),
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      );
  }

  public logout(): Observable<boolean> {
    return this.client
      .post(
        `${this.baseUri}/auth/logout`,
        {},
        {
          observe: 'response',
        }
      )
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.status === 200) {
            this.userLogedOut();
            return true;
          }
          return false;
        }),
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      );
  }

  private userLogedOut(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.loggedIn.next(false);
  }
}
