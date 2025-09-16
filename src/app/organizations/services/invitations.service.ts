import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  InvitationDTO,
  InviteUserToOrganizationDTO,
} from '../models/invitations.models';
import { DataResult, Result } from '../../common/models/result.models';
import { catchError, map, Observable, of } from 'rxjs';
import { navigateToErrorPage } from '../../common/services/error-utilities';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class InvitationsService {
  public constructor(
    private readonly client: HttpClient,
    private readonly router: Router
  ) {}

  public get(): Observable<DataResult<InvitationDTO[]>> {
    return this.client
      .get<InvitationDTO[]>(`http://192.168.0.100:5081/invitations`)
      .pipe(
        map((res: InvitationDTO[]) => DataResult.success<InvitationDTO[]>(res)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          navigateToErrorPage(this.router, error);
          return of(DataResult.fail<InvitationDTO[]>());
        })
      );
  }

  public send(userEmail: string): Observable<Result> {
    var organizationId = localStorage.getItem('organization')!;
    var dto = new InviteUserToOrganizationDTO(
      userEmail,
      Number(organizationId)
    );
    return this.client.post('http://192.168.0.100:5081/invitations', dto).pipe(
      map(() => Result.success()),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        navigateToErrorPage(this.router, error);
        return of(Result.fail());
      })
    );
  }

  public accept(initationId: number, accepted: boolean): Observable<Result> {
    return this.client
      .post(`http://192.168.0.100:5081/invitations/${initationId}`, null, {
        params: new HttpParams().set('accepted', accepted),
      })
      .pipe(
        map(() => Result.success()),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          navigateToErrorPage(this.router, error);
          return of(Result.fail());
        })
      );
  }
}
