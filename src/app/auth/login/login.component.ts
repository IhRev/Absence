import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UserCredentials } from '../models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService: AuthService;
  private readonly router: Router;
  public userName: string = '';
  public password: string = '';

  public constructor(authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
  }

  public login(): void {
    this.authService
      .login(new UserCredentials(this.userName, this.password))
      .subscribe({
        next: (isSuccess) => {
          if (isSuccess) {
            this.router.navigate(['/home']);
          }
        },
      });
  }
}
