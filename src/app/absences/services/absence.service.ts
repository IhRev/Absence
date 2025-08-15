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
import { DataResult } from '../../common/models/result.models';
import { Router } from '@angular/router';
import { navigateToErrorPage } from '../../common/services/error-utilities';

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
    endDate: Date,
    userId: number | null = null
  ): Observable<DataResult<AbsenceDTO[]>> {
    var organizationId = localStorage.getItem('organization');
    var url: string = userId
      ? `http://192.168.0.179:5081/organizations/${organizationId}/users/${userId}/absences`
      : `http://192.168.0.179:5081/organizations/${organizationId}/absences`;
    return this.client
      .get<AbsenceDTO[]>(url, {
        params: new HttpParams()
          .set('startDate', this.toLocalDateString(startDate))
          .set('endDate', this.toLocalDateString(endDate)),
      })
      .pipe(
        map((res: AbsenceDTO[]) => DataResult.success<AbsenceDTO[]>(res)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
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
  ): Observable<DataResult<number | string>> =>
    this.client.post<any>('http://192.168.0.179:5081/absences', absence).pipe(
      map(
        (res) => DataResult.success<number | string>(res),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          navigateToErrorPage(this.router, error);
          return of(DataResult.fail<number | string>());
        })
      )
    );

  public editAbsence = (
    absence: EditAbsenceDTO
  ): Observable<DataResult<string>> =>
    this.client.put<string>('http://192.168.0.179:5081/absences', absence).pipe(
      map((res) => DataResult.success<string>(res)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        navigateToErrorPage(this.router, error);
        return of(DataResult.fail<string>());
      })
    );

  public deleteAbsence = (id: number): Observable<DataResult<string>> =>
    this.client.delete<string>(`http://192.168.0.179:5081/absences/${id}`).pipe(
      map((res) => DataResult.success<string>(res)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        navigateToErrorPage(this.router, error);
        return of(DataResult.fail<string>());
      })
    );
}
