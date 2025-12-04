import { Component, effect, input, output, signal } from '@angular/core';
import {
  CreateOrganizationDTO,
  EditOrganizationDTO,
  Organization,
} from '../models/organizations.models';
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
  styleUrls: [
    './organization-form.component.css',
    '../../common/styles/modal-dialog-styles.css',
  ],
})
export class OrganizationFormComponent {
  organization = input<Organization | null>(null);
  closeModal = output();
  submitCreate = output<CreateOrganizationDTO>();
  submitEdit = output<EditOrganizationDTO>();
  title = signal('Add');
  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
  });

  constructor() {
    effect(() => {
      if (this.organization()) {
        this.form.setValue({
          name: this.organization()!.name,
        });
        queueMicrotask(() => this.title.set('Edit'));
      } else {
        this.form.setValue({
          name: 'My Organization',
        });
        queueMicrotask(() => this.title.set('Add'));
      }
    });
  }

  submit() {
    if (this.form.valid) {
      if (this.organization()) {
        this.submitEdit.emit(
          new EditOrganizationDTO(
            this.organization()!.id,
            this.form.value.name!
          )
        );
      } else {
        this.submitCreate.emit(
          new CreateOrganizationDTO(this.form.value.name!)
        );
      }
    }
  }
}
