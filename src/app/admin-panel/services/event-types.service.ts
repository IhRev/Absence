import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EventTypeDTO } from '../models/events.models';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventTypesService {
  readonly #client = inject(HttpClient);

  types!: EventTypeDTO[];

  load(): Observable<any> {
    return this.#client
      .get<EventTypeDTO[]>(`${environment.apiUrl}/absences/event_types`)
      .pipe(
        tap((res) => (this.types = res)),
        catchError((e) => {
          console.error(e);
          return throwError(() => e);
        })
      );
  }
}
