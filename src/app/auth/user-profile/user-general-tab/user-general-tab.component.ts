import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { Message } from '../../models/user-profile.models';

@Component({
  selector: 'app-user-general-tab',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule, NgFor],
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
  @Output() displayMessage = new EventEmitter<Message>();

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
          this.displayMsg(res.isSuccess, res.message);
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
          this.displayMsg(res.isSuccess, res.message);
          this.isProcessing = false;
        },
      });
  }

  public getErrorMessage = getErrorMessage;

  public getErrors(columnName: string) {
    return getErrors(this.form, columnName);
  }

  private displayMsg(isSuccess: boolean, message: string | null): void {
    this.displayMessage.emit(new Message(isSuccess, message));
  }
}
