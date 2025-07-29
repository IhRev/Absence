import { Component, Input, input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserSecurityTabComponent } from './user-security-tab/user-security-tab.component';
import { UserGeneralTabComponent } from './user-general-tab/user-general-tab.component';
import { UserInvitationsTabComponent } from './user-invitations-tab/user-invitations-tab.component';
import { Message } from '../models/user-profile.models';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    FormsModule,
    UserGeneralTabComponent,
    UserSecurityTabComponent,
    UserInvitationsTabComponent,
    NgIf,
    NgClass,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  public activeTab: string = 'general';
  public message: Message | null = null;

  public displayMessage(message: Message): void {
    this.message = message;
  }

  public closeMessage(): void {
    this.message = null;
  }

  public switchTab(tabName: string): void {
    this.activeTab = tabName;
    this.message = null;
  }
}
