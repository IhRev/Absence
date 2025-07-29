import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
import { DataResult, Result } from '../../common/models/result.models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUri: string = 'http://192.168.0.179:5081';
  private loggedIn = new BehaviorSubject<boolean>(this.tokenExists());

  public loggedIn$ = this.loggedIn.asObservable();

  public constructor(
    private readonly client: HttpClient,
    private readonly router: Router
  ) {}

  private tokenExists(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // user
  public getUserDetails(): Observable<DataResult<UserDetails>> {
    return this.client.get<UserDetails>(`${this.baseUri}/users/details`).pipe(
      map((res) => {
        return DataResult.success<UserDetails>(res);
      }),
      catchError((error) => {
        console.error(error);
        return of(DataResult.fail<UserDetails>());
      })
    );
  }

  public updateUserDetails(userDetails: UserDetails): Observable<Result> {
    return this.client.put(`${this.baseUri}/users/details`, userDetails).pipe(
      map((res) => {
        return Result.success();
      }),
      catchError((error) => {
        console.error(error);
        return of(Result.fail(error));
      })
    );
  }

  public changePassword(request: ChangePasswordRequest): Observable<Result> {
    return this.client
      .put(`${this.baseUri}/users/change_password`, request)
      .pipe(
        map((res) => {
          this.logoutLocally();
          return Result.success();
        }),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          if (error.status === 400) {
            return of(Result.fail(error.error));
          }
          return of(Result.fail());
        })
      );
  }

  public deleteProfile(password: string): Observable<Result> {
    return this.client
      .delete(`${this.baseUri}/users`, {
        body: new DeleteUserRequest(password),
      })
      .pipe(
        map((res) => {
          localStorage.clear();
          this.loggedIn.next(false);
          return Result.success();
        }),
        catchError((error) => {
          console.error(error);
          return of(Result.fail(error));
        })
      );
  }

  // auth
  public login(credentials: UserCredentials): Observable<Result> {
    return this.client
      .post<AuthResponse>(`${this.baseUri}/auth/login`, credentials)
      .pipe(
        map((res) => {
          if (res.isSuccess) {
            localStorage.setItem('accessToken', res.accessToken!);
            localStorage.setItem('refreshToken', res.refreshToken!);
            this.loggedIn.next(true);
            return Result.success();
          }
          return Result.fail(res.message!);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          if (error.status === 401) {
            return of(Result.fail('Incorrect password or email'));
          }
          this.router.navigate(['/error'], { queryParams: { status: 500 } });
          return of(Result.fail('Something went wrong'));
        })
      );
  }

  public refreshToken(): Observable<Result> {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');
    return this.client
      .post<AuthResponse>(`${this.baseUri}/auth/refresh_token`, {
        refreshToken: refreshToken,
        accessToken: accessToken,
      })
      .pipe(
        map((res) => {
          if (res.isSuccess) {
            localStorage.setItem('accessToken', res.accessToken!);
            localStorage.setItem('refreshToken', res.refreshToken!);
            return Result.success();
          }
          return Result.fail(res.message!);
        }),
        catchError((error) => {
          console.error(error);
          return of(Result.fail(error));
        })
      );
  }

  public register(registerDTO: RegisterDTO): Observable<Result> {
    return this.client
      .post<any>(`${this.baseUri}/auth/register`, registerDTO)
      .pipe(
        map((res) => {
          return Result.success();
        }),
        catchError((error) => {
          console.error(error);
          return of(Result.fail(error));
        })
      );
  }

  public logout(): Observable<Result> {
    return this.client.post(`${this.baseUri}/auth/logout`, null).pipe(
      map((res) => {
        this.logoutLocally();
        return Result.success();
      }),
      catchError((error) => {
        console.error(error);
        return of(Result.fail(error));
      })
    );
  }

  public logoutLocally(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.loggedIn.next(false);
  }
}
