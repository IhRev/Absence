import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AbsenceTypeDTO } from '../models/absence-list.models';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AbsenceTypeService {
  private readonly client: HttpClient;

  public constructor(client: HttpClient) {
    this.client = client;
  }

  public getTypes(): Observable<AbsenceTypeDTO[] | null> {
    return this.client
      .get<AbsenceTypeDTO[]>('http://192.168.0.179:5081/absence_types', {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<AbsenceTypeDTO[]>) => {
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
}
