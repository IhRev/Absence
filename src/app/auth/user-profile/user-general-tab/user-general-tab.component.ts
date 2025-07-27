import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserDetails } from '../../models/auth.models';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  getErrorMessage,
  getErrors,
} from '../../../common/services/error-utilities';

@Component({
  selector: 'app-user-general-tab',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule, NgFor, NgClass],
  templateUrl: './user-general-tab.component.html',
  styleUrl: './user-general-tab.component.css',
})
export class UserGeneralTabComponent implements OnInit {
  public form = new FormGroup({
    email: new FormControl(''),
    firstName: new FormControl('', { validators: [Validators.required] }),
    lastName: new FormControl('', { validators: [Validators.required] }),
  });
  public loaded: boolean = false;
  public isProcessing: boolean = false;
  public message: string | null = null;
  public isSuccess: boolean = false;

  public get firstNameIsInvalid(): boolean {
    return (
      this.form.controls.firstName.touched &&
      this.form.controls.firstName.invalid
    );
  }

  public get lastNameIsInvalid(): boolean {
    return (
      this.form.controls.lastName.touched && this.form.controls.lastName.invalid
    );
  }

  constructor(private readonly authService: AuthService) {}

  public ngOnInit(): void {
    this.isProcessing = true;
    this.authService.getUserDetails().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.form.setValue(res.data!);
        } else {
          this.message = res.message!;
        }
        this.loaded = res.isSuccess;
        this.isProcessing = false;
      },
    });
  }

  public edit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isProcessing = true;

    this.authService
      .updateUserDetails(
        new UserDetails(
          this.form.value.firstName!,
          this.form.value.lastName!,
          this.form.value.email!
        )
      )
      .subscribe({
        next: (res) => {
          this.message = res.message!;
          this.isSuccess = res.isSuccess!;
          this.isProcessing = false;
        },
      });
  }

  public getErrorMessage = getErrorMessage;

  public getErrors(columnName: string) {
    return getErrors(this.form, columnName);
  }

  public closeMessage(): void {
    this.message = null;
  }
}
