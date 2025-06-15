import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { RegisterDTO, UserCredentials } from '../models/auth.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private authService: AuthService;
  private router: Router;
  public firstName: string = '';
  public lastName: string = '';
  public email: string = '';
  public password: string = '';

  public constructor(authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
  }

  public submit(): void {
    this.authService
      .register(
        new RegisterDTO(
          this.firstName,
          this.lastName,
          new UserCredentials(this.email, this.password)
        )
      )
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.router.navigate(['/login']);
          }
        },
      });
  }
}
