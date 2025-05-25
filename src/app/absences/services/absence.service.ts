import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import {
  AbsenceDTO,
  CreateAbsenceDTO,
  EditAbsenceDTO,
} from '../models/absence.models';
import { catchError, map, Observable, of } from 'rxjs';
import { DataResult, Result } from '../../common/models/result.models';
import { AbsenceFilters } from '../models/filters.models';

@Injectable({
  providedIn: 'root',
})
export class AbsenceService {
  private readonly client: HttpClient;

  public constructor(client: HttpClient) {
    this.client = client;
  }

  public getAbsences = (
    startDate: Date,
    endDate: Date
  ): Observable<DataResult<AbsenceDTO[]>> =>
    this.client
      .get<AbsenceDTO[]>('http://192.168.0.179:5081/absences', {
        params: new HttpParams()
          .set('startDate', startDate.toISOString())
          .set('endDate', endDate.toISOString()),
      })
      .pipe(
        map((res: AbsenceDTO[]) => {
          return DataResult.success<AbsenceDTO[]>(res);
        }),
        catchError((error) => {
          console.error(error);
          return of(DataResult.fail<AbsenceDTO[]>(error));
        })
      );

  public addAbsence = (
    absence: CreateAbsenceDTO
  ): Observable<DataResult<number>> =>
    this.client
      .post<number>('http://192.168.0.179:5081/absences', absence)
      .pipe(
        map((res: number) => DataResult.success<number>(res)),
        catchError((error) => {
          console.error(error);
          return of(DataResult.fail<number>(error));
        })
      );

  public editAbsence = (absence: EditAbsenceDTO): Observable<Result> =>
    this.client.put('http://192.168.0.179:5081/absences', absence).pipe(
      map(() => Result.success()),
      catchError((error) => {
        console.error(error);
        return of(Result.fail(error));
      })
    );

  public deleteAbsence = (id: number): Observable<Result> =>
    this.client.delete(`http://192.168.0.179:5081/absences/${id}`).pipe(
      map(() => Result.success()),
      catchError((error) => {
        console.error(error);
        return of(Result.fail(error));
      })
    );
}
