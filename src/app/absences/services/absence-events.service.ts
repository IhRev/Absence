import { Injectable } from '@angular/core';
import {
  AbsenceEvent,
  AbsenceEventDTO,
  AbsenceEventTypeDTO,
} from '../models/events.models';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { DataResult, Result } from '../../common/models/result.models';
import { navigateToErrorPage } from '../../common/services/error-utilities';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AbsenceEventsService {
  private types: AbsenceEventTypeDTO[] = [];

  public constructor(
    private readonly client: HttpClient,
    private readonly router: Router
  ) {
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
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          navigateToErrorPage(this.router, error);
          return of(DataResult.fail<AbsenceEventDTO[]>());
        })
      );
  }

  public respond = (eventId: number, accepted: boolean): Observable<Result> =>
    this.client
      .post<any>(`http://192.168.0.179:5081/events/${eventId}`, null, {
        params: new HttpParams().set('accepted', accepted),
      })
      .pipe(
        map(() => Result.success()),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          navigateToErrorPage(this.router, error);
          return of(Result.fail());
        })
      );

  private loadTypes(): void {
    this.client
      .get<AbsenceEventTypeDTO[]>(
        `http://192.168.0.100:5081/absences/event_types`
      )
      .subscribe({
        next: (res) => (this.types = res),
        error: (e) => {
          console.error(e);
          navigateToErrorPage(this.router, e);
        },
      });
  }
}
