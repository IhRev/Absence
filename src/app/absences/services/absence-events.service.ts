import { Injectable } from '@angular/core';
import {
  AbsenceEvent,
  AbsenceEventDTO,
  AbsenceEventTypeDTO,
} from '../models/events.models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { DataResult, Result } from '../../common/models/result.models';

@Injectable({
  providedIn: 'root',
})
export class AbsenceEventsService {
  private readonly client: HttpClient;
  private types: AbsenceEventTypeDTO[] = [];

  public constructor(client: HttpClient) {
    this.client = client;
    this.loadTypes();
  }

  public getEvents(): Observable<DataResult<AbsenceEvent[]>> {
    var organizationId = localStorage.getItem('organization');
    return this.client
      .get<AbsenceEventDTO[]>(
        `http://192.168.0.179:5081/organizations/${organizationId}/absences/events`
      )
      .pipe(
        map((res: AbsenceEventDTO[]) => {
          return DataResult.success<AbsenceEvent[]>(
            res.map(
              (r) =>
                new AbsenceEvent(
                  r.id,
                  r.name,
                  r.startDate,
                  r.endDate,
                  r.absenceType,
                  r.userId,
                  this.types.find((t) => t.id === r.absenceEventType)!.name
                )
            )
          );
        }),
        catchError((error) => {
          console.error(error);
          return of(DataResult.fail<AbsenceEventDTO[]>(error));
        })
      );
  }

  public respond = (eventId: number, accepted: boolean): Observable<Result> =>
    this.client
      .post<any>(`http://192.168.0.179:5081/events/${eventId}`, null, {
        params: new HttpParams().set('accepted', accepted),
      })
      .pipe(
        map(
          () => {
            return Result.success();
          },
          catchError((error) => {
            console.error(error);
            return of(Result.fail(error));
          })
        )
      );

  private loadTypes(): void {
    this.client
      .get<AbsenceEventTypeDTO[]>(
        `http://192.168.0.179:5081/absences/event_types`
      )
      .subscribe({
        next: (res) => {
          this.types = res;
        },
        error: (e) => {
          console.error(e);
        },
      });
  }
}
