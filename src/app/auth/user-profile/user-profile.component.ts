import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserSecurityTabComponent } from './user-security-tab/user-security-tab.component';
import { UserGeneralTabComponent } from './user-general-tab/user-general-tab.component';
import { UserInvitationsTabComponent } from './user-invitations-tab/user-invitations-tab.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    FormsModule,
    UserGeneralTabComponent,
    UserSecurityTabComponent,
    UserInvitationsTabComponent,
    NgIf,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  public title: string = 'General';
  public activeTab: string = 'general';
}
