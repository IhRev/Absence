import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);

  errorMsg = signal<string | null>(null);

  login(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.#authService
      .login(
        new UserCredentials(form.form.value.email, form.form.value.password)
      )
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.#router.navigate(['/home']);
          } else {
            this.errorMsg.set(res.message);
          }
        },
      });
  }
}
