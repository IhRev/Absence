import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateOrganizationDTO } from '../models/organizations.models';
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
  selector: 'app-organization-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ModalFormComponent,
    FormErrorComponent,
  ],
  templateUrl: './organization-form.component.html',
  styleUrl: './organization-form.component.css',
})
export class OrganizationFormComponent {
  @Input() public isVisible = false;
  @Output() public closeModal = new EventEmitter();
  @Output() public submitModal = new EventEmitter<CreateOrganizationDTO>();
  public title: string = 'Add';
  public form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
  });

  public close(): void {
    this.closeModal.emit();
  }

  public submit(): void {
    if (this.form.valid) {
      this.submitModal.emit(new CreateOrganizationDTO(this.form.value.name!));
    }
  }
}
