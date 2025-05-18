import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AbsenceTypeDTO } from '../models/absence-list.models';
import { catchError, map, Observable, of, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AbsenceTypeService {
  private readonly client: HttpClient;
  private types = new ReplaySubject<AbsenceTypeDTO[] | null>(1);
  private loaded: boolean = false;

  public constructor(client: HttpClient) {
    this.client = client;
  }

  public getTypes(): Observable<AbsenceTypeDTO[] | null> {
    if (!this.loaded) {
      this.client
        .get<AbsenceTypeDTO[]>('http://192.168.0.179:5081/absence_types', {
          observe: 'response',
        })
        .subscribe({
          next: (res) => {
            if (res.status == 200) {
              this.types.next(res.body);
              this.loaded = true;
            }
          },
          error: (e) => {
            console.error(e);
            this.types.next(null);
          },
        });
    }

    return this.types.asObservable();
  }
}
