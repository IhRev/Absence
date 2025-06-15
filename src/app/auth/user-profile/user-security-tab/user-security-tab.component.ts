import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ChangePasswordRequest } from '../../models/auth.models';
import { Router } from '@angular/router';
import { PasswordConfirmationComponent } from '../../../common/password-confirmation/password-confirmation.component';

@Component({
  selector: 'app-user-security-tab',
  standalone: true,
  imports: [PasswordConfirmationComponent, FormsModule],
  templateUrl: './user-security-tab.component.html',
  styleUrl: './user-security-tab.component.css',
})
export class UserSecurityTabComponent {
  private authService: AuthService;
  private router: Router;
  public oldPassword: string = '';
  public newPassword: string = '';
  public confirmationOpened: boolean = false;

  public constructor(authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
  }

  public submit(): void {
    this.authService
      .changePassword(
        new ChangePasswordRequest(this.oldPassword, this.newPassword)
      )
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.router.navigate(['/login']);
          }
        },
      });
  }

  public confirmationSubmitted(password: string): void {
    this.confirmationOpened = false;
    this.authService.deleteProfile(password).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.router.navigate(['/home']);
        }
      },
    });
  }

  public logout(): void {
    this.authService.logout().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.router.navigate(['/home']);
        }
      },
    });
  }
}
