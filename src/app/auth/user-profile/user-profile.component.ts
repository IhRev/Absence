import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserDetails } from '../models/auth.models';
import { FormsModule } from '@angular/forms';
import { PasswordConfirmationComponent } from '../../common/password-confirmation/password-confirmation.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [FormsModule, PasswordConfirmationComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  private authService: AuthService;
  private router: Router;
  public details: UserDetails = null!;
  public confirmationOpened: boolean = false;

  constructor(authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
  }
  public ngOnInit(): void {
    this.authService.getUserDetails().subscribe({
      next: (details) => {
        if (details) {
          this.details = details;
        }
      },
    });
  }

  public logout(): void {
    this.authService.logout().subscribe({
      next: (isSuccess) => {
        if (isSuccess) {
          this.router.navigate(['/home']);
        }
      },
    });
  }

  public edit(): void {
    this.authService.updateUserDetails(this.details).subscribe({
      next: (isSuccess) => {
        if (isSuccess) {
        }
      },
    });
  }

  public confirmationSubmitted(password: string): void {
    this.confirmationOpened = false;
    this.authService.deleteProfile(password).subscribe({
      next: (isSuccess) => {
        if (isSuccess) {
          this.router.navigate(['/home']);
        }
      },
    });
  }
}
