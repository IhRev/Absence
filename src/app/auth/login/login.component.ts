import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UserCredentials } from '../models/auth.models';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  public errorMsg: string | null = '';

  public constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  login(form: NgForm) {
    if (form.invalid) {
      return;
    }

    var email = form.form.value.email;
    var password = form.form.value.password;
    this.authService.login(new UserCredentials(email, password)).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.router.navigate(['/home']);
        } else {
          this.errorMsg = res.message!;
        }
      },
    });
  }
}
