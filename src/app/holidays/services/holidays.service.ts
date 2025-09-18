import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CreateHolidayDTO,
  EditHolidayDTO,
  HolidayDTO,
} from '../models/holidays.models';
import { catchError, map, Observable, of } from 'rxjs';
import { DataResult, Result } from '../../common/models/result.models';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { navigateToErrorPage } from '../../common/services/error-utilities';

@Injectable({
  providedIn: 'root',
})
export class HolidaysService {
  public constructor(
    private readonly client: HttpClient,
    private readonly router: Router
  ) {}

  public getHolidays(
    organizationId: number
  ): Observable<DataResult<HolidayDTO[]>> {
    return this.client
      .get<HolidayDTO[]>(
        `${environment.apiUrl}/organizations/${organizationId}/holidays`
      )
      .pipe(
        map((res: HolidayDTO[]) => DataResult.success<HolidayDTO[]>(res)),
        catchError((error) => {
          console.error(error);
          navigateToErrorPage(this.router, error);
          return of(DataResult.fail<HolidayDTO[]>());
        })
      );
  }

  public addHoliday(holiday: CreateHolidayDTO): Observable<DataResult<number>> {
    return this.client
      .post<number>(`${environment.apiUrl}/holidays`, holiday)
      .pipe(
        map((res: number) => DataResult.success<number>(res)),
        catchError((error) => {
          console.error(error);
          navigateToErrorPage(this.router, error);
          return of(DataResult.fail<number>());
        })
      );
  }

  public editHoliday(holiday: EditHolidayDTO): Observable<Result> {
    return this.client.put(`${environment.apiUrl}/holidays`, holiday).pipe(
      map(() => Result.success()),
      catchError((error) => {
        console.error(error);
        navigateToErrorPage(this.router, error);
        return of(Result.fail());
      })
    );
  }

  public deleteHoliday(id: number): Observable<Result> {
    return this.client.delete(`${environment.apiUrl}/holidays/${id}`).pipe(
      map(() => Result.success()),
      catchError((error) => {
        console.error(error);
        navigateToErrorPage(this.router, error);
        return of(Result.fail());
      })
    );
  }
}
