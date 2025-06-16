import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  CreateOrganizationDTO,
  MemberDTO,
  Organization,
} from './models/organizations.models';
import { OrganizationsService } from './services/organizations.service';
import { OrganizationFormComponent } from './organization-form/organization-form.component';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [NgIf, NgFor, OrganizationFormComponent],
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.css',
})
export class OrganizationsComponent implements OnInit {
  public organizations: Organization[] = [];
  public members: MemberDTO[] = [];
  public selectedOrganization: Organization | null = null;
  public selectedMember: MemberDTO | null = null;
  public isFormOpened: boolean = false;

  public constructor(private organizationService: OrganizationsService) {}

  public ngOnInit(): void {
    this.organizationService.get().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.organizations = res.data!;
          var organizationId = localStorage.getItem('organization');
          if (organizationId) {
            this.selectedOrganization = this.organizations.find(
              (o) => o.id === Number(organizationId)
            )!;
            this.loadMembers();
          }
        }
      },
    });
  }

  public selectOrganization(selected: Organization): void {
    this.organizationService.selectOrganization(selected);
    this.selectedOrganization = selected;
    this.loadMembers();
  }

  public selectMember(selected: MemberDTO): void {
    this.selectedMember = selected;
  }

  public add(organization: CreateOrganizationDTO): void {
    this.organizationService.add(organization).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.organizations.push(
            new Organization(res.data!, organization.name, true, true)
          );
        }
        this.isFormOpened = false;
      },
    });
  }

  public openForm(): void {
    this.isFormOpened = true;
  }

  public closeForm(): void {
    this.isFormOpened = false;
  }

  private loadMembers(): void {
    this.organizationService.getMembers().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.members = res.data!;
        }
      },
    });
  }
}
