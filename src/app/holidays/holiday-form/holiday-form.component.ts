import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CreateHolidayDTO,
  EditHolidayDTO,
  Holiday,
} from '../models/holidays.models';
import { ModalFormComponent } from '../../common/modal-form/modal-form.component';
import { FormErrorComponent } from '../../common/form-error/form-error.component';

@Component({
  selector: 'app-holiday-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ModalFormComponent,
    FormErrorComponent,
  ],
  templateUrl: './holiday-form.component.html',
  styleUrls: [
    './holiday-form.component.css',
    '../../common/styles/modal-dialog-styles.css',
  ],
})
export class HolidayFormComponent implements OnChanges {
  @Input() public isVisible = false;
  @Input() public holiday: Holiday | null = null;
  @Output() public closeModal = new EventEmitter();
  @Output() public submitCreate = new EventEmitter<CreateHolidayDTO>();
  @Output() public submitEdit = new EventEmitter<EditHolidayDTO>();

  public message?: string;
  public form = new FormGroup({
    name: new FormControl('Holiday', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
    date: new FormControl('', [Validators.required]),
  });
  public title: string = '';

  public ngOnChanges(): void {
    if (this.isVisible) {
      if (this.holiday) {
        this.form.setValue({
          name: this.holiday.name,
          date: this.getDateOnlyString(new Date(this.holiday.date)),
        });
        this.title = 'Update Holiday';
      } else {
        this.form.setValue({
          name: 'Holiday',
          date: this.getDateOnlyString(new Date()),
        });
        this.title = 'Add Holiday';
      }
    }
  }

  public close(): void {
    this.closeModal.emit();
  }

  public submit(): void {
    if (this.form.valid) {
      if (this.holiday) {
        this.submitEdit.emit(
          new EditHolidayDTO(
            this.holiday.id,
            this.form.value.name!,
            new Date(this.form.value.date!)
          )
        );
      } else {
        this.submitCreate.emit(
          new CreateHolidayDTO(
            this.form.value.name!,
            new Date(this.form.value.date!),
            Number(localStorage.getItem('organization')!)
          )
        );
      }
    }
  }

  private getDateOnlyString = (date: Date): string =>
    date.toISOString().split('T')[0];
}
