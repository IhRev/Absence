import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
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
import { PasswordConfirmationComponent } from '../common/password-confirmation/password-confirmation.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { WrappableControlComponent } from '../common/wrappable-control/wrappable-control.component';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    OrganizationFormComponent,
    InviteFormComponent,
    PasswordConfirmationComponent,
    NgClass,
    WrappableControlComponent,
    NgTemplateOutlet,
  ],
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
  public organization: Organization | null = null;
  public confirmationOpened: boolean = false;
  public isProcessing: boolean = false;
  public message: string | null = null;
  public isSuccess: boolean = false;
  public isMobile: boolean = false;

  public constructor(
    private readonly organizationService: OrganizationsService,
    private readonly invitationsService: InvitationsService,
    private readonly breakingObserver: BreakpointObserver
  ) {}

  public ngOnInit(): void {
    this.breakingObserver.observe([Breakpoints.Handset]).subscribe((res) => {
      this.isMobile = res.matches;
    });
    this.organizationService.organizations$.subscribe((value) => {
      this.organizations = value;
    });
    this.organizationService.selectedOrganization$.subscribe((value) => {
      if (value) {
        this.selectedOrganization = value;
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
    if (selected === this.selectedMember) {
      this.selectedMember = null;
    } else {
      this.selectedMember = selected;
    }
  }

  public add(organization: CreateOrganizationDTO): void {
    this.isProcessing = true;
    this.organizationService.add(organization).subscribe({
      next: (res) => {
        this.message = res.message;
        this.isSuccess = res.isSuccess;
        this.isFormOpened = false;
        this.isProcessing = false;
      },
    });
  }

  public openForm(organization?: Organization): void {
    this.isFormOpened = true;
    this.organization = organization ? organization : null;
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
    this.isProcessing = true;
    this.invitationsService.send(email).subscribe({
      next: (res) => {
        this.message = res.message;
        this.isSuccess = res.isSuccess;
        this.isInviteFormOpened = false;
        this.isProcessing = false;
      },
    });
  }

  public changeAccess(): void {
    this.isProcessing = true;
    this.organizationService
      .changeAccess(
        this.selectedOrganization!.id,
        this.selectedMember!.id,
        true
      )
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.selectedMember!.isAdmin = true;
          }
          this.isProcessing = false;
          this.message = res.message;
          this.isSuccess = res.isSuccess;
        },
      });
  }

  public deleteUser(): void {
    this.isProcessing = true;
    var id = this.selectedMember!.id;
    this.organizationService
      .deleteMember(this.selectedOrganization!.id, this.selectedMember!.id)
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.members = this.members!.filter((m) => m.id != id);
            this.selectedMember = null;
          }
          this.isProcessing = false;
          this.message = res.message;
          this.isSuccess = res.isSuccess;
        },
      });
  }

  public edit(organization: EditOrganizationDTO): void {
    this.isProcessing = true;
    this.organizationService.edit(organization).subscribe({
      next: (res) => {
        this.message = res.message;
        this.isSuccess = res.isSuccess;
        this.isFormOpened = false;
        this.isProcessing = false;
      },
    });
  }

  private loadMembers(): void {
    this.isProcessing = true;
    this.organizationService.getMembers().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.selectedMember = null;
          this.members = res.data!;
          this.selectedMember = res.data!.find((m) => m.isOwner)!;
        }
        this.isProcessing = false;
      },
    });
  }

  public confirmationSubmitted(password: string): void {
    this.confirmationOpened = false;
    this.isProcessing = true;
    this.organizationService
      .delete(this.selectedOrganization!.id, password)
      .subscribe({
        next: (res) => {
          this.message = res.message;
          this.isSuccess = res.isSuccess;
          this.isProcessing = false;
        },
      });
  }
}
