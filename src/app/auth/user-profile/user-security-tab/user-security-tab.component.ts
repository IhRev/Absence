import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ChangePasswordRequest } from '../../models/auth.models';
import { Router } from '@angular/router';
import { PasswordConfirmationComponent } from '../../../common/password-confirmation/password-confirmation.component';
import { NgIf } from '@angular/common';
import { Message } from '../../models/user-profile.models';
import { FormErrorComponent } from '../../../common/form-error/form-error.component';

@Component({
  selector: 'app-user-security-tab',
  standalone: true,
  imports: [
    PasswordConfirmationComponent,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    FormErrorComponent,
  ],
  templateUrl: './user-security-tab.component.html',
  styleUrl: './user-security-tab.component.css',
})
export class UserSecurityTabComponent {
  public form = new FormGroup({
    oldPassword: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
    newPassword: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  public isProcessing: boolean = false;
  public confirmationOpened: boolean = false;
  @Output() displayMessage = new EventEmitter<Message>();

  public constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isProcessing = true;
    this.authService
      .changePassword(
        new ChangePasswordRequest(
          this.form.value.oldPassword!,
          this.form.value.newPassword!
        )
      )
      .subscribe({
        next: (res) => {
          this.isProcessing = false;
          this.displayMsg(res.isSuccess, res.message);
          if (res.isSuccess) {
            this.router.navigate(['/login']);
          }
        },
      });
  }

  public confirmationSubmitted(password: string): void {
    this.confirmationOpened = false;
    this.isProcessing = true;
    this.authService.deleteProfile(password).subscribe({
      next: (res) => {
        this.isProcessing = false;
        this.displayMsg(res.isSuccess, res.message);
        if (res.isSuccess) {
          this.router.navigate(['/home']);
        }
      },
    });
  }

  public logout(): void {
    this.isProcessing = true;
    this.authService.logout().subscribe({
      next: (res) => {
        this.isProcessing = false;
        this.displayMsg(res.isSuccess, res.message);
        if (res.isSuccess) {
          this.router.navigate(['/home']);
        }
      },
    });
  }

  private displayMsg(isSuccess: boolean, message: string | null): void {
    this.displayMessage.emit(new Message(isSuccess, message));
  }
}
