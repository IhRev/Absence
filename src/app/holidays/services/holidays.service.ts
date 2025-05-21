import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HolidaysDTO } from '../models/holidays.models';
import { catchError, map, Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class HolidaysService {
  private readonly client: HttpClient;

  public constructor(client: HttpClient) {
    this.client = client;
  }

  public getHolidays(): Observable<HolidaysDTO[] | null> {
    return this.client
      .get<HolidaysDTO[]>('http://192.168.0.179:5081/holidays', {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<HolidaysDTO[]>) => {
          if (res.status == 200) {
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

  public addHoliday(holiday: HolidaysDTO): Observable<number | null> {
    return this.client
      .post<number>('http://192.168.0.179:5081/holidays', holiday, {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<number>) => {
          if (res.status == 200) {
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

  public editHoliday(holiday: HolidaysDTO): Observable<boolean> {
    return this.client
      .put('http://192.168.0.179:5081/holidays', holiday, {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.status == 200) {
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

  public deleteHoliday(id: number): Observable<boolean> {
    return this.client
      .delete(`http://192.168.0.179:5081/holidays/${id}`, {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.status == 200) {
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
}
