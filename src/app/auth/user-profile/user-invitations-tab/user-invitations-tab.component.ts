import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { InvitationsService } from '../../../organizations/services/invitations.service';
import { NgIf } from '@angular/common';
import { Message } from '../../models/user-profile.models';
import { Invitation } from '../../models/invitations.models';

@Component({
  selector: 'app-user-invitations-tab',
  standalone: true,
  imports: [NgIf],
  templateUrl: './user-invitations-tab.component.html',
  styleUrl: './user-invitations-tab.component.css',
})
export class UserInvitationsTabComponent implements OnInit {
  public invitations: Invitation[] | null = null;
  @Output() displayMessage = new EventEmitter<Message>();
  public isProcessing: boolean = false;
  private static lastInvitationNum: number = 0;

  public constructor(private readonly invitationsService: InvitationsService) {}

  public ngOnInit(): void {
    this.isProcessing = true;
    this.invitationsService.get().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          UserInvitationsTabComponent.lastInvitationNum = 0;
          this.invitations = res.data!.map(
            (i) =>
              new Invitation(
                ++UserInvitationsTabComponent.lastInvitationNum,
                i.id,
                i.organization,
                i.inviter
              )
          );
        } else {
          this.displayMsg(false, res.message);
        }
        this.isProcessing = false;
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
    this.isProcessing = true;
    this.invitationsService.accept(invitation, accepted).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.invitations = this.invitations!.filter(
            (i) => i.id != invitation
          );
          UserInvitationsTabComponent.lastInvitationNum = 0;
          this.invitations.forEach(
            (i) => (i.num = ++UserInvitationsTabComponent.lastInvitationNum)
          );
        } else {
          this.displayMsg(false, res.message);
        }
        this.isProcessing = true;
      },
    });
  }

  private displayMsg(isSuccess: boolean, message: string | null): void {
    this.displayMessage.emit(new Message(isSuccess, message));
  }
}
