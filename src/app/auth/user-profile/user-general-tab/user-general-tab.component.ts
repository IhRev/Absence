import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserDetails } from '../../models/auth.models';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-general-tab',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './user-general-tab.component.html',
  styleUrl: './user-general-tab.component.css',
})
export class UserGeneralTabComponent implements OnInit {
  private authService: AuthService;
  public details: UserDetails = null!;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public ngOnInit(): void {
    this.authService.getUserDetails().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.details = res.data!;
        }
      },
    });
  }

  public edit(): void {
    this.authService.updateUserDetails(this.details).subscribe({
      next: (res) => {
        if (res.isSuccess) {
        }
      },
    });
  }
}
