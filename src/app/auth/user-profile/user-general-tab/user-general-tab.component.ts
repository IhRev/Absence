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
import { NgIf } from '@angular/common';
import { Message } from '../../models/user-profile.models';
import { FormErrorComponent } from '../../../common/form-error/form-error.component';

@Component({
  selector: 'app-user-general-tab',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule, FormErrorComponent],
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

  private displayMsg(isSuccess: boolean, message: string | null): void {
    this.displayMessage.emit(new Message(isSuccess, message));
  }
}
