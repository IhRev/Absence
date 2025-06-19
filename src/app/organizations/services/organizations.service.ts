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
  private organizations = new BehaviorSubject<OrganizationDTO[] | null>(null);

  public selectedOrganization$ = this.selectedOrganization.asObservable();
  public organizations$ = this.organizations.asObservable();

  public constructor(client: HttpClient) {
    this.client = client;
    this.load();
  }

  private load(): void {
    this.client
      .get<OrganizationDTO[]>('http://192.168.0.179:5081/organizations')
      .pipe(
        map((res: OrganizationDTO[]) => {
          var organizations = res.map(
            (dto) =>
              new Organization(dto.id, dto.name, dto.isAdmin, dto.isOwner)
          );
          return DataResult.success<Organization[]>(organizations);
        }),
        catchError((e) => {
          console.error(e);
          return of(DataResult.fail<Organization[]>(e));
        })
      )
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.organizations.next(res.data!);

            var organizationId = localStorage.getItem('organization');
            if (organizationId) {
              const organization = res.data!.find(
                (o) => o.id === Number(organizationId)
              )!;
              this.selectedOrganization.next(organization);
            }
          }
        },
      });
  }

  public add(
    organization: CreateOrganizationDTO
  ): Observable<DataResult<number>> {
    return this.client
      .post<number>('http://192.168.0.179:5081/organizations', organization)
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
