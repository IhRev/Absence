import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
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
  styleUrl: './organization-form.component.css',
})
export class OrganizationFormComponent implements OnChanges {
  @Input() public isVisible = false;
  @Input() public organization: Organization | null = null;
  @Output() public closeModal = new EventEmitter();
  @Output() public submitCreate = new EventEmitter<CreateOrganizationDTO>();
  @Output() public submitEdit = new EventEmitter<EditOrganizationDTO>();
  public title: string = 'Add';
  public form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
  });

  ngOnChanges(): void {
    if (this.isVisible) {
      if (this.organization) {
        this.form.setValue({
          name: this.organization.name,
        });
        this.title = 'Edit';
      } else {
        this.form.setValue({
          name: 'My Organization',
        });
        this.title = 'Add';
      }
    }
  }

  public close(): void {
    this.closeModal.emit();
  }

  public submit(): void {
    if (this.form.valid) {
      if (this.organization) {
        this.submitEdit.emit(
          new EditOrganizationDTO(this.organization.id, this.form.value.name!)
        );
      } else {
        this.submitCreate.emit(
          new CreateOrganizationDTO(this.form.value.name!)
        );
      }
    }
  }
}
