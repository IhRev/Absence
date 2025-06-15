import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import {
  CreateOrganizationDTO,
  MemberDTO,
  Organization,
  OrganizationDTO,
} from '../models/organizations.models';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { DataResult } from '../../common/models/result.models';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  private readonly client: HttpClient;
  private selectedOrganization = new BehaviorSubject<Organization | null>(null);

  public selectedOrganization$ = this.selectedOrganization.asObservable();

  public constructor(client: HttpClient) {
    this.client = client;
  }

  public get(): Observable<DataResult<Organization[]>> {
    return this.client
      .get<OrganizationDTO[]>('http://192.168.0.179:5081/organizations')
      .pipe(
        map((res: OrganizationDTO[]) => {
          var organizations = res.map(
            (dto) =>
              new Organization(dto.id, dto.name, dto.isAdmin, dto.isOwner)
          );
          var organizationId = localStorage.getItem('organization');
          if (organizationId) {
            const organization = organizations.find(
              (o) => o.id === Number(organizationId)
            )!;
            this.selectedOrganization.next(organization);
          }
          return DataResult.success<Organization[]>(organizations);
        }),
        catchError((e) => {
          console.error(e);
          return of(DataResult.fail<Organization[]>(e));
        })
      );
  }

  public add(name: string): Observable<DataResult<number>> {
    var dto = new CreateOrganizationDTO(name);
    return this.client
      .post<number>('http://192.168.0.179:5081/organizations', dto)
      .pipe(
        map((res: number) => {
          return DataResult.success<number>(res);
        }),
        catchError((error) => {
          console.error(error);
          return of(DataResult.fail<number>(error));
        })
      );
  }

  public getMembers(): Observable<DataResult<MemberDTO[]>> {
    return this.client
      .get<MemberDTO[]>(
        `http://192.168.0.179:5081/organizations/${this.selectedOrganization.value?.id}/members`
      )
      .pipe(
        map((res: MemberDTO[]) => {
          return DataResult.success<MemberDTO[]>(res);
        }),
        catchError((error) => {
          console.error(error);
          return of(DataResult.fail<MemberDTO[]>(error));
        })
      );
  }

  public selectOrganization(organization: Organization) {
    localStorage.setItem('organization', organization.id.toString());
    this.selectedOrganization.next(organization);
  }
}
