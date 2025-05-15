import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AbsenceDTO, EditAbsenceDTO } from '../models/absence-list.models';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AbsenceService {
  private readonly client: HttpClient;

  public constructor(client: HttpClient) {
    this.client = client;
  }

  public getAbsences(): Observable<AbsenceDTO[] | null> {
    return this.client
      .get<AbsenceDTO[]>('http://192.168.0.179:5081/absences', {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<AbsenceDTO[]>) => {
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

  public addAbsence(absence: AbsenceDTO): Observable<number | null> {
    return this.client
      .post<number>('http://192.168.0.179:5081/absences', absence, {
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

  public editAbsence(absence: EditAbsenceDTO): Observable<boolean> {
    return this.client
      .put('http://192.168.0.179:5081/absences', absence, {
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

  public deleteAbsence(id: number): Observable<boolean> {
    return this.client
      .delete(`http://192.168.0.179:5081/absences/${id}`, {
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
