import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { DataResult, Result } from '../../common/models/result.models';
import { EventDTO } from '../models/events.models';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  public constructor(private readonly client: HttpClient) {}

  public getEvents(): Observable<DataResult<EventDTO[]>> {
    var organizationId = localStorage.getItem('organization');
    return this.client
      .get<EventDTO[]>(
        `http://192.168.0.179:5081/organizations/${organizationId}/absences/events`
      )
      .pipe(
        map((res: EventDTO[]) => {
          return DataResult.success<EventDTO[]>(res);
        }),
        catchError((error) => {
          console.error(error);
          return of(DataResult.fail<EventDTO[]>(error));
        })
      );
  }

  public respond(eventId: number, accepted: boolean): Observable<Result> {
    return this.client
      .post<any>(`http://192.168.0.179:5081/absences/events/${eventId}`, null, {
        params: new HttpParams().set('accepted', accepted),
      })
      .pipe(
        map(() => {
          return Result.success();
        }),
        catchError((error) => {
          console.error(error);
          return of(Result.fail(error));
        })
      );
  }
}
