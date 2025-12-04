import { Component, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalFormComponent } from '../../common/modal-form/modal-form.component';
import { FormErrorComponent } from '../../common/form-error/form-error.component';

@Component({
  selector: 'app-invite-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ModalFormComponent,
    FormErrorComponent,
  ],
  templateUrl: './invite-form.component.html',
  styleUrls: [
    './invite-form.component.css',
    '../../common/styles/modal-dialog-styles.css',
  ],
})
export class InviteFormComponent {
  closeModal = output();
  submitModal = output<string>();
  form = new FormGroup({
    email: new FormControl('', [Validators.email]),
  });

  submit() {
    if (this.form.valid) {
      this.submitModal.emit(this.form.value.email!);
    }
  }
}
