import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbsenceTypeDTO } from '../models/absence.models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AbsenceTypeService {
  private readonly client: HttpClient;
  private types = new BehaviorSubject<AbsenceTypeDTO[] | null>(null);
  public types$ = this.types.asObservable();

  public constructor(client: HttpClient) {
    this.client = client;
    this.load();
  }

  private load(): void {
    this.client
      .get<AbsenceTypeDTO[]>('http://192.168.0.179:5081/absences/types')
      .subscribe({
        next: (res: AbsenceTypeDTO[]) => {
          this.types.next(res);
        },
        error: (e) => {
          console.error(e);
          this.types.next(null);
        },
      });
  }
}
