import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import {
  AbsenceDTO,
  CreateAbsenceDTO,
  EditAbsenceDTO,
} from '../models/absence.models';
import { catchError, map, Observable, of } from 'rxjs';
import { DataResult, Result } from '../../common/models/result.models';
import { Router } from '@angular/router';
import { navigateToErrorPage } from '../../common/services/error-utilities';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AbsenceService {
  public constructor(
    private readonly client: HttpClient,
    private readonly router: Router
  ) {}

  public getAbsences(
    startDate: Date,
    endDate: Date
  ): Observable<DataResult<AbsenceDTO[]>> {
    var organizationId = localStorage.getItem('organization');
    return this.client
      .get<AbsenceDTO[]>(
        `${environment.apiUrl}/organizations/${organizationId}/absences`,
        {
          params: new HttpParams()
            .set('startDate', this.toLocalDateString(startDate))
            .set('endDate', this.toLocalDateString(endDate)),
        }
      )
      .pipe(
        map((res: AbsenceDTO[]) => DataResult.success<AbsenceDTO[]>(res)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          if (error.status === 400) {
            return of(DataResult.fail<AbsenceDTO[]>(error.error));
          }
          navigateToErrorPage(this.router, error);
          return of(DataResult.fail<AbsenceDTO[]>());
        })
      );
  }

  public getAbsencesBySelectedUsers(
    startDate: Date,
    endDate: Date,
    usersIds: number[]
  ): Observable<DataResult<AbsenceDTO[]>> {
    var organizationId = localStorage.getItem('organization');
    return this.client
      .post<AbsenceDTO[]>(
        `${environment.apiUrl}/organizations/${organizationId}/absences`,
        usersIds,
        {
          params: new HttpParams()
            .set('startDate', this.toLocalDateString(startDate))
            .set('endDate', this.toLocalDateString(endDate)),
        }
      )
      .pipe(
        map((res: AbsenceDTO[]) => DataResult.success<AbsenceDTO[]>(res)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          if (error.status === 400) {
            return of(DataResult.fail<AbsenceDTO[]>(error.error));
          }
          navigateToErrorPage(this.router, error);
          return of(DataResult.fail<AbsenceDTO[]>());
        })
      );
  }

  private toLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public addAbsence = (
    absence: CreateAbsenceDTO
  ): Observable<DataResult<number | null>> =>
    this.client.post<any>(`${environment.apiUrl}/absences`, absence).pipe(
      map((res) => {
        if (typeof res === 'number') {
          return DataResult.success<number | null>(
            res,
            'Absence added successfully'
          );
        } else {
          return DataResult.success<number | null>(null, res.message);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        if (error.status === 400) {
          return of(DataResult.fail<number | null>(error.error));
        }
        navigateToErrorPage(this.router, error);
        return of(DataResult.fail<number | null>());
      })
    );

  public editAbsence = (absence: EditAbsenceDTO): Observable<Result> =>
    this.client
      .put<{ message: string }>('${environment.apiUrl}/absences', absence)
      .pipe(
        map((res) => Result.success(res.message)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          if (error.status === 400) {
            return of(Result.fail(error.error));
          }
          navigateToErrorPage(this.router, error);
          return of(Result.fail());
        })
      );

  public deleteAbsence = (id: number): Observable<Result> =>
    this.client
      .delete<{ message: string }>(`${environment.apiUrl}/absences/${id}`)
      .pipe(
        map((res) => Result.success(res.message)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          if (error.status === 400) {
            return of(Result.fail(error.error));
          }
          navigateToErrorPage(this.router, error);
          return of(Result.fail());
        })
      );
}
