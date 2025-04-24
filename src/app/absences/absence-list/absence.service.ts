import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbsenceDTO } from './absence-list.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AbsenceService {
  private readonly client: HttpClient;

  public constructor(client: HttpClient) {
    this.client = client;
  }

  public getAbsences(): Observable<AbsenceDTO[]> {
    return this.client.get<AbsenceDTO[]>('http://192.168.0.179:5081/absences');
  }

  public addAbsence(absence: AbsenceDTO): Observable<number> {
    return this.client.post<number>(
      'http://192.168.0.179:5081/absences',
      absence
    );
  }
}
