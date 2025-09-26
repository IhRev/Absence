import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  styleUrl: './invite-form.component.css',
})
export class InviteFormComponent {
  @Input() public isVisible = false;
  @Output() public closeModal = new EventEmitter();
  @Output() public submitModal = new EventEmitter<string>();
  public form = new FormGroup({
    email: new FormControl('', [Validators.email]),
  });

  public close(): void {
    this.closeModal.emit();
  }

  public submit(): void {
    if (this.form.valid) {
      this.submitModal.emit(this.form.value.email!);
    }
  }
}
