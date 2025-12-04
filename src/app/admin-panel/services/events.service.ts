import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { DataResult, Result } from '../../common/models/result.models';
import { EventDTO } from '../models/events.models';
import { environment } from '../../../environments/environment';
import { OrganizationsService } from '../../organizations/services/organizations.service';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  readonly #client = inject(HttpClient);
  readonly #organizationsService = inject(OrganizationsService);

  getEvents(): Observable<DataResult<EventDTO[]>> {
    return this.#client
      .get<EventDTO[]>(
        `${environment.apiUrl}/organizations/${
          this.#organizationsService.selectedOrganization()!.id
        }/absences/events`
      )
      .pipe(
        map((res: EventDTO[]) => DataResult.success<EventDTO[]>(res)),
        catchError((error) => {
          console.error(error);
          return of(DataResult.fail<EventDTO[]>(error));
        })
      );
  }

  respond(eventId: number, accepted: boolean): Observable<Result> {
    return this.#client
      .post<any>(`${environment.apiUrl}/absences/events/${eventId}`, null, {
        params: new HttpParams().set('accepted', accepted),
      })
      .pipe(
        map(() => Result.success()),
        catchError((error) => {
          console.error(error);
          return of(Result.fail(error));
        })
      );
  }
}
