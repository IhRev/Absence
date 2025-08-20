import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  public submit(): void {
    this.submitted.emit(this.password);
  }

  public close(): void {
    this.closed.emit();
  }
}
