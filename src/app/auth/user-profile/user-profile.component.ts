import { Component, inject, Input, input, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserSecurityTabComponent } from './user-security-tab/user-security-tab.component';
import { UserGeneralTabComponent } from './user-general-tab/user-general-tab.component';
import { UserInvitationsTabComponent } from './user-invitations-tab/user-invitations-tab.component';
import { Message } from '../models/user-profile.models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    FormsModule,
    UserGeneralTabComponent,
    UserSecurityTabComponent,
    UserInvitationsTabComponent,
    NgClass,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  readonly #route = inject(ActivatedRoute);

  activeTab = signal('general');
  message = signal<Message | null>(null);

  ngOnInit() {
    this.#route.queryParams.subscribe((params) => {
      const tabName = params['tabName'];
      if (tabName) {
        this.activeTab.set(tabName);
      }
    });
  }

  displayMessage(message: Message) {
    this.message.set(message);
  }

  switchTab(tabName: string) {
    this.activeTab.set(tabName);
    this.message.set(null);
  }
}
