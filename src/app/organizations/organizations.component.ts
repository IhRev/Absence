import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  CreateOrganizationDTO,
  EditOrganizationDTO,
  MemberDTO,
  Organization,
} from './models/organizations.models';
import { OrganizationsService } from './services/organizations.service';
import { OrganizationFormComponent } from './organization-form/organization-form.component';
import { InviteFormComponent } from './invite-form/invite-form.component';
import { InvitationsService } from './services/invitations.service';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [NgIf, NgFor, OrganizationFormComponent, InviteFormComponent],
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.css',
})
export class OrganizationsComponent implements OnInit {
  public organizations: Organization[] | null = null;
  public members: MemberDTO[] | null = null;
  public selectedOrganization: Organization | null = null;
  public selectedMember: MemberDTO | null = null;
  public isFormOpened: boolean = false;
  public isInviteFormOpened: boolean = false;

  public constructor(
    private readonly organizationService: OrganizationsService,
    private readonly invitationsService: InvitationsService
  ) {}

  public ngOnInit(): void {
    this.organizationService.organizations$.subscribe((value) => {
      this.organizations = value;
    });
    this.organizationService.selectedOrganization$.subscribe((value) => {
      if (value) {
        this.selectedOrganization = value;
        this.selectedMember = null;
        this.loadMembers();
      } else {
        this.selectedOrganization = null;
        this.selectedMember = null;
        this.members = null;
      }
    });
  }

  public selectOrganization(selected: Organization): void {
    if (selected === this.selectedOrganization) {
      this.organizationService.unselectOrganization();
    } else {
      this.organizationService.selectOrganization(selected);
    }
  }

  public selectMember(selected: MemberDTO): void {
    this.selectedMember = selected;
  }

  public add(organization: CreateOrganizationDTO): void {
    this.organizationService.add(organization).subscribe({
      next: (res) => {
        if (res.isSuccess) {
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

  public openInviteForm(): void {
    this.isInviteFormOpened = true;
  }

  public closeInviteForm(): void {
    this.isInviteFormOpened = false;
  }

  public sendInvitation(email: string): void {
    this.invitationsService.send(email).subscribe({
      next: (res) => {
        if (res.isSuccess) {
        }
        this.isInviteFormOpened = false;
      },
    });
  }

  public changeAccess(): void {}
  public delete(): void {
    this.organizationService.delete(this.selectedOrganization!.id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
        }
        this.isFormOpened = false;
      },
    });
  }

  public edit(organization: EditOrganizationDTO): void {
    this.organizationService.edit(organization).subscribe({
      next: (res) => {
        if (res.isSuccess) {
        }
        this.isFormOpened = false;
      },
    });
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
