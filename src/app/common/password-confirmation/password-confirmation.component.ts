import { Component, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalFormComponent } from '../modal-form/modal-form.component';
import { FormErrorComponent } from '../form-error/form-error.component';

@Component({
  selector: 'app-password-confirmation',
  standalone: true,
  imports: [ReactiveFormsModule, ModalFormComponent, FormErrorComponent],
  templateUrl: './password-confirmation.component.html',
  styleUrls: [
    './password-confirmation.component.css',
    '../styles/modal-dialog-styles.css',
  ],
})
export class PasswordConfirmationComponent {
  submitted = output<string>();
  closed = output();
  form = new FormGroup({
    password: new FormControl('', [Validators.minLength(8)]),
  });

  submit() {
    if (this.form.valid) {
      this.submitted.emit(this.form.value.password!);
    }
  }
}
