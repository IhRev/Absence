import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbsenceTypeDTO } from '../models/absence-list.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AbsenceTypeService {
  private readonly client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  getTypes(): Observable<AbsenceTypeDTO[]> {
    return this.client.get<AbsenceTypeDTO[]>(
      'http://192.168.0.179:5081/absence_types'
    );
  }
}
