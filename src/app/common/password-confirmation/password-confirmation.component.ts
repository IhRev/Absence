import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { getErrorMessage, getErrors } from '../services/error-utilities';

@Component({
  selector: 'app-password-confirmation',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule, NgFor],
  templateUrl: './password-confirmation.component.html',
  styleUrl: './password-confirmation.component.css',
})
export class PasswordConfirmationComponent {
  @Input() public isVisible: boolean = false;
  @Output() public submitted = new EventEmitter<string>();
  @Output() public closed = new EventEmitter();
  public password: string = '';
  public form = new FormGroup({
    password: new FormControl('', [Validators.minLength(8)]),
  });
  public get passwordIsInvalid() {
    return (
      this.form.controls.password.touched && this.form.controls.password.dirty
    );
  }

  public submit(): void {
    this.submitted.emit(this.password);
  }

  public close(): void {
    this.closed.emit();
  }

  public getErrors(columnName: string) {
    return getErrors(this.form, columnName);
  }

  public getErrorMessage = getErrorMessage;
}
