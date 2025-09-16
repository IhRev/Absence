import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CreateHolidayDTO,
  EditHolidayDTO,
  HolidayDTO,
} from '../models/holidays.models';
import { catchError, map, Observable, of } from 'rxjs';
import { DataResult, Result } from '../../common/models/result.models';
@Injectable({
  providedIn: 'root',
})
export class HolidaysService {
  private readonly client: HttpClient;

  public constructor(client: HttpClient) {
    this.client = client;
  }

  public getHolidays(
    organizationId: number
  ): Observable<DataResult<HolidayDTO[]>> {
    return this.client
      .get<HolidayDTO[]>(
        `http://192.168.0.100:5081/organizations/${organizationId}/holidays`
      )
      .pipe(
        map((res: HolidayDTO[]) => {
          return DataResult.success<HolidayDTO[]>(res);
        }),
        catchError((error) => {
          console.error(error);
          return of(DataResult.fail<HolidayDTO[]>(error));
        })
      );
  }

  public addHoliday(holiday: CreateHolidayDTO): Observable<DataResult<number>> {
    return this.client
      .post<number>('http://192.168.0.100:5081/holidays', holiday)
      .pipe(
        map((res: number) => {
          return DataResult.success<number>(res);
        }),
        catchError((error) => {
          console.error(error);
          return of(DataResult.fail<number>(error));
        })
      );
  }

  public editHoliday(holiday: EditHolidayDTO): Observable<Result> {
    return this.client.put('http://192.168.0.100:5081/holidays', holiday).pipe(
      map((res: any) => {
        return Result.success();
      }),
      catchError((error) => {
        console.error(error);
        return of(Result.fail(error));
      })
    );
  }

  public deleteHoliday(id: number): Observable<Result> {
    return this.client.delete(`http://192.168.0.100:5081/holidays/${id}`).pipe(
      map((res: any) => {
        return Result.success();
      }),
      catchError((error) => {
        console.error(error);
        return of(Result.fail(error));
      })
    );
  }
}
