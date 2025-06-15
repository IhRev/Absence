import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  InvitationDTO,
  InviteUserToOrganizationDTO,
} from '../models/invitations.models';
import { DataResult, Result } from '../../common/models/result.models';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvitationsService {
  private readonly client: HttpClient;

  public constructor(client: HttpClient) {
    this.client = client;
  }

  public get(): Observable<DataResult<InvitationDTO[]>> {
    return this.client
      .get<InvitationDTO[]>(`http://192.168.0.179:5081/invitations`)
      .pipe(
        map((res: InvitationDTO[]) => {
          return DataResult.success<InvitationDTO[]>(res);
        }),
        catchError((error) => {
          console.error(error);
          return of(DataResult.fail<InvitationDTO[]>(error));
        })
      );
  }

  public send(userEmail: string): Observable<Result> {
    var organizationId = localStorage.getItem('organization')!;
    var dto = new InviteUserToOrganizationDTO(
      userEmail,
      Number(organizationId)
    );
    return this.client
      .post<number>('http://192.168.0.179:5081/invitations', dto)
      .pipe(
        map((res: number) => {
          return Result.success();
        }),
        catchError((error) => {
          console.error(error);
          return of(Result.fail(error));
        })
      );
  }

  public accept(initationId: number, accepted: boolean): Observable<Result> {
    return this.client
      .post<any>(`http://192.168.0.179:5081/invitations/${initationId}`, null, {
        params: new HttpParams().set('accepted', accepted),
      })
      .pipe(
        map(() => {
          return Result.success();
        }),
        catchError((error) => {
          console.error(error);
          return of(Result.fail(error));
        })
      );
  }
}
