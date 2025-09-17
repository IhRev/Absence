import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbsenceTypeDTO } from '../models/absence.models';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { navigateToErrorPage } from '../../common/services/error-utilities';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AbsenceTypeService {
  private types = new BehaviorSubject<AbsenceTypeDTO[] | null>(null);
  public types$ = this.types.asObservable();

  public constructor(
    private readonly client: HttpClient,
    private readonly router: Router
  ) {
    this.load();
  }

  private load(): void {
    this.client
      .get<AbsenceTypeDTO[]>(`${environment.apiUrl}/absences/types`)
      .subscribe({
        next: (res: AbsenceTypeDTO[]) => {
          this.types.next(res);
        },
        error: (e) => {
          console.error(e);
          this.types.next(null);
          navigateToErrorPage(this.router, e);
        },
      });
  }
}
