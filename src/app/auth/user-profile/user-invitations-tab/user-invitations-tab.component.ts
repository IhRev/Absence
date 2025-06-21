import { Component, OnInit } from '@angular/core';
import { InvitationsService } from '../../../organizations/services/invitations.service';
import { InvitationDTO } from '../../../organizations/models/invitations.models';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-invitations-tab',
  standalone: true,
  imports: [NgIf],
  templateUrl: './user-invitations-tab.component.html',
  styleUrl: './user-invitations-tab.component.css',
})
export class UserInvitationsTabComponent implements OnInit {
  public invitations: InvitationDTO[] | null = null;

  public constructor(private readonly invitationsService: InvitationsService) {}

  public ngOnInit(): void {
    this.invitationsService.get().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.invitations = res.data!;
        }
      },
    });
  }

  public accept(invitation: number): void {
    this.send(invitation, true);
  }

  public reject(invitation: number): void {
    this.send(invitation, false);
  }

  private send(invitation: number, accepted: boolean): void {
    this.invitationsService.accept(invitation, accepted).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.invitations = this.invitations!.filter(
            (i) => i.id != invitation
          );
        }
      },
    });
  }
}
