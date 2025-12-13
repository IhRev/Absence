import { Component, inject, OnInit, output, signal } from '@angular/core';
import { InvitationsService } from '../../../organizations/services/invitations.service';
import { Message } from '../../models/user-profile.models';
import { Invitation } from '../../models/invitations.models';
import { OrganizationsService } from '../../../organizations/services/organizations.service';

@Component({
  selector: 'app-user-invitations-tab',
  standalone: true,
  imports: [],
  templateUrl: './user-invitations-tab.component.html',
  styleUrl: './user-invitations-tab.component.css',
})
export class UserInvitationsTabComponent implements OnInit {
  readonly #invitationsService = inject(InvitationsService);
  readonly #organizationsService = inject(OrganizationsService);
  #lastInvitationNum: number = 0;

  invitations = signal<Invitation[] | null>(null);
  displayMessage = output<Message>();
  isProcessing = signal(false);

  ngOnInit() {
    this.isProcessing.set(true);
    this.#invitationsService.get().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.#lastInvitationNum = 0;
          this.invitations.set(
            res.data!.map(
              (i) =>
                new Invitation(
                  ++this.#lastInvitationNum,
                  i.id,
                  i.organization,
                  i.inviter
                )
            )
          );
        } else {
          this.#displayMsg(false, res.message);
        }
        this.isProcessing.set(false);
      },
    });
  }

  send(invitation: number, accepted: boolean) {
    this.isProcessing.set(true);
    this.#invitationsService.accept(invitation, accepted).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.invitations.update((prev) => {
            this.#lastInvitationNum = 0;
            return prev!
              .filter((i) => i.id != invitation)
              .map((i) => {
                i.num = ++this.#lastInvitationNum;
                return i;
              });
          });
          this.#organizationsService.load().subscribe();
        } else {
          this.#displayMsg(false, res.message);
        }
        this.isProcessing.set(true);
      },
    });
  }

  #displayMsg(isSuccess: boolean, message: string | null) {
    this.displayMessage.emit(new Message(isSuccess, message));
  }
}
