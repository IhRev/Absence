import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import {
  AbsenceDTO,
  CreateAbsenceDTO,
  EditAbsenceDTO,
} from '../models/absence.models';
import { catchError, map, Observable, of } from 'rxjs';
import { DataResult, Result } from '../../common/models/result.models';
import { Router } from '@angular/router';
import { navigateToErrorPage } from '../../common/services/error-utilities';
import { environment } from '../../../environments/environment';
import { DateHelper } from '../../common/helpers/date-helper';
import { OrganizationsService } from '../../organizations/services/organizations.service';

@Injectable({
  providedIn: 'root',
})
export class AbsenceService {
  readonly #client = inject(HttpClient);
  readonly #router = inject(Router);
  readonly #organizationsService = inject(OrganizationsService);

  getAbsences(
    startDate: Date,
    endDate: Date
  ): Observable<DataResult<AbsenceDTO[]>> {
    return this.#client
      .get<AbsenceDTO[]>(
        `${environment.apiUrl}/organizations/${
          this.#organizationsService.selectedOrganization()!.id
        }/absences`,
        {
          params: new HttpParams()
            .set('startDate', DateHelper.getDateOnlyString(startDate))
            .set('endDate', DateHelper.getDateOnlyString(endDate)),
        }
      )
      .pipe(
        map((res: AbsenceDTO[]) => DataResult.success<AbsenceDTO[]>(res)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          if (error.status === 400) {
            return of(DataResult.fail<AbsenceDTO[]>(error.error));
          }
          navigateToErrorPage(this.#router, error);
          return of(DataResult.fail<AbsenceDTO[]>());
        })
      );
  }

  getAbsencesBySelectedUsers(
    startDate: Date,
    endDate: Date,
    usersIds: number[]
  ): Observable<DataResult<AbsenceDTO[]>> {
    return this.#client
      .post<AbsenceDTO[]>(
        `${
          environment.apiUrl
        }/organizations/${this.#organizationsService.selectedOrganization()}/absences`,
        usersIds,
        {
          params: new HttpParams()
            .set('startDate', DateHelper.getDateOnlyString(startDate))
            .set('endDate', DateHelper.getDateOnlyString(endDate)),
        }
      )
      .pipe(
        map((res: AbsenceDTO[]) => DataResult.success<AbsenceDTO[]>(res)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          if (error.status === 400) {
            return of(DataResult.fail<AbsenceDTO[]>(error.error));
          }
          navigateToErrorPage(this.#router, error);
          return of(DataResult.fail<AbsenceDTO[]>());
        })
      );
  }

  addAbsence(absence: CreateAbsenceDTO): Observable<DataResult<number | null>> {
    return this.#client
      .post<any>(`${environment.apiUrl}/absences`, absence)
      .pipe(
        map((res) =>
          typeof res === 'number'
            ? DataResult.success<number | null>(
                res,
                'Absence added successfully'
              )
            : DataResult.success<number | null>(null, res.message)
        ),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          if (error.status === 400) {
            return of(DataResult.fail<number | null>(error.error));
          }
          navigateToErrorPage(this.#router, error);
          return of(DataResult.fail<number | null>());
        })
      );
  }

  editAbsence(absence: EditAbsenceDTO): Observable<Result> {
    return this.#client
      .put<{ message: string }>(`${environment.apiUrl}/absences`, absence)
      .pipe(
        map((res) => Result.success(res.message)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          if (error.status === 400) {
            return of(Result.fail(error.error));
          }
          navigateToErrorPage(this.#router, error);
          return of(Result.fail());
        })
      );
  }

  deleteAbsence(id: number): Observable<Result> {
    return this.#client
      .delete<{ message: string }>(`${environment.apiUrl}/absences/${id}`)
      .pipe(
        map((res) => Result.success(res.message)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          if (error.status === 400) {
            return of(Result.fail(error.error));
          }
          navigateToErrorPage(this.#router, error);
          return of(Result.fail());
        })
      );
  }
}
