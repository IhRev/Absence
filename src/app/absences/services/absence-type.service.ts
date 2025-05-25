import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbsenceDTO, AbsenceTypeDTO } from '../models/absence.models';
import { map, Observable, of, ReplaySubject } from 'rxjs';
import { DataResult } from '../../common/models/result.models';

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

  public getTypes(): Observable<DataResult<AbsenceTypeDTO[]>> {
    if (!this.loaded) {
      this.client
        .get<AbsenceTypeDTO[]>('http://192.168.0.179:5081/absence_types')
        .subscribe({
          next: (res: AbsenceTypeDTO[]) => {
            this.types.next(res);
            this.loaded = true;
          },
          error: (e) => {
            console.error(e);
            this.types.next(null);
          },
        });
    }

    return this.types.pipe(
      map((value) => {
        return value !== null
          ? DataResult.success<AbsenceTypeDTO[]>(value)
          : DataResult.fail<AbsenceDTO[]>('Loading types failed');
      })
    );
  }
}
