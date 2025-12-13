import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbsenceTypeDTO } from '../models/absence.models';
import { environment } from '../../../environments/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AbsenceTypeService {
  readonly #client = inject(HttpClient);

  types: AbsenceTypeDTO[] | null = null;

  load(): Observable<any> {
    return this.#client
      .get<AbsenceTypeDTO[]>(`${environment.apiUrl}/absences/types`)
      .pipe(
        tap((res) => (this.types = res)),
        catchError((e) => {
          console.error(e);
          return throwError(() => e);
        })
      );
  }

  unload() {
    this.types = null;
  }
}
