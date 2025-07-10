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
  public userName: string = '';
  public password: string = '';

  public constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  public login(): void {
    this.authService
      .login(new UserCredentials(this.userName, this.password))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.router.navigate(['/home']);
          }
        },
      });
  }
}
