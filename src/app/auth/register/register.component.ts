import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { RegisterDTO, UserCredentials } from '../models/auth.models';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import {
  getErrorMessage,
  getErrors,
} from '../../common/services/error-utilities';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private authService: AuthService;
  private router: Router;
  public form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
    firstName: new FormControl('', { validators: [Validators.required] }),
    lastName: new FormControl('', { validators: [Validators.required] }),
  });

  public get emailIsInvalid(): boolean {
    return this.form.controls.email.touched && this.form.controls.email.dirty;
  }

  public get passwordIsInvalid(): boolean {
    return (
      this.form.controls.password.touched && this.form.controls.password.dirty
    );
  }

  public get firstNameIsInvalid(): boolean {
    return (
      this.form.controls.firstName.touched && this.form.controls.firstName.dirty
    );
  }

  public get lastNameIsInvalid(): boolean {
    return (
      this.form.controls.lastName.touched && this.form.controls.lastName.dirty
    );
  }

  public constructor(authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.authService
      .register(
        new RegisterDTO(
          this.form.value.firstName!,
          this.form.value.lastName!,
          new UserCredentials(this.form.value.email!, this.form.value.password!)
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

  public getErrorMessage = getErrorMessage;

  public getErrors(columnName: string) {
    return getErrors(this.form, columnName);
  }
}
