import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CreateOrganizationDTO,
  EditOrganizationDTO,
  MemberDTO,
  Organization,
  OrganizationDTO,
} from '../models/organizations.models';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { DataResult, Result } from '../../common/models/result.models';
import { AuthService } from '../../auth/services/auth.service';
import { navigateToErrorPage } from '../../common/services/error-utilities';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  private selectedOrganization = new BehaviorSubject<Organization | null>(null);
  private organizations = new BehaviorSubject<OrganizationDTO[] | null>(null);

  public selectedOrganization$ = this.selectedOrganization.asObservable();
  public organizations$ = this.organizations.asObservable();

  public constructor(
    private readonly client: HttpClient,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.authService.loggedIn$.subscribe((status) => {
      if (status) {
        this.load();
      } else {
        this.unload();
      }
    });
  }

  private unload(): void {
    this.selectedOrganization.next(null);
    this.organizations.next(null);
  }

  private load(): void {
    this.client
      .get<OrganizationDTO[]>('http://192.168.0.100:5081/organizations')
      .pipe(
        map((res: OrganizationDTO[]) => {
          var organizations = res.map(
            (dto) =>
              new Organization(dto.id, dto.name, dto.isAdmin, dto.isOwner)
          );
          return DataResult.success<Organization[]>(organizations);
        }),
        catchError((e: HttpErrorResponse) => {
          console.error(e);
          navigateToErrorPage(this.router, e);
          return of(DataResult.fail<Organization[]>());
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
      .post<number>('http://192.168.0.100:5081/organizations', organization)
      .pipe(
        map((res: number) => {
          var organizations = [
            ...this.organizations.value!,
            new Organization(res, organization.name, true, true),
          ];
          this.organizations.next(organizations);
          return DataResult.success<number>(res);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          navigateToErrorPage(this.router, error);
          return of(DataResult.fail<number>());
        })
      );
  }

  public getMembers(): Observable<DataResult<MemberDTO[]>> {
    return this.client
      .get<MemberDTO[]>(
        `http://192.168.0.100:5081/organizations/${this.selectedOrganization.value?.id}/members`
      )
      .pipe(
        map((res: MemberDTO[]) => DataResult.success<MemberDTO[]>(res)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          navigateToErrorPage(this.router, error);
          return of(DataResult.fail<MemberDTO[]>());
        })
      );
  }

  public selectOrganization(organization: Organization): void {
    localStorage.setItem('organization', organization.id.toString());
    this.selectedOrganization.next(organization);
  }

  public unselectOrganization(): void {
    localStorage.removeItem('organization');
    this.selectedOrganization.next(null);
  }

  public edit(organization: EditOrganizationDTO): Observable<Result> {
    return this.client
      .put('http://192.168.0.100:5081/organizations', organization)
      .pipe(
        map(() => {
          var edited = new Organization(
            organization.id,
            organization.name,
            true,
            true
          );
          this.organizations.next(
            this.organizations.value!.map((u) =>
              u.id === organization.id ? edited : u
            )
          );
          this.selectedOrganization.next(edited);
          return Result.success();
        }),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          navigateToErrorPage(this.router, error);
          return of(Result.fail());
        })
      );
  }

  public delete(id: number): Observable<Result> {
    return this.client
      .delete<any>(`http://192.168.0.100:5081/organizations/${id}`)
      .pipe(
        map(() => {
          this.organizations.next(
            this.organizations.value!.filter((u) => u.id != id)
          );
          this.selectedOrganization.next(null);
          return Result.success();
        }),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          navigateToErrorPage(this.router, error);
          return of(Result.fail());
        })
      );
  }
}
