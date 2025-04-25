import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService: AuthService;
  private readonly router: Router;
  public userName: string = '';
  public password: string = '';
  public message: string = '';

  public constructor(authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
  }

  public login(): void {
    this.authService.login(this.userName, this.password).subscribe({
      next: (isSuccess) => {
        if (isSuccess) {
          this.router.navigate(['/home']);
        } else {
          this.message = 'Invalid login or password';
        }
      },
      error: (e) => (this.message = 'Unexpected error'),
    });
  }
}
