import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbsenceFilters } from '../models/filters.models';
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
  selector: 'app-absence-filters',
  standalone: true,
  imports: [
    FormsModule,
    ModalFormComponent,
    ReactiveFormsModule,
    FormErrorComponent,
  ],
  templateUrl: './absence-filters.component.html',
  styleUrls: [
    './absence-filters.component.css',
    '../../common/styles/modal-dialog-styles.css',
  ],
})
export class AbsenceFiltersComponent implements OnInit {
  @Input() public isVisible = false;
  @Output() public closeModal = new EventEmitter();
  @Output() public submitModal = new EventEmitter<AbsenceFilters>();

  public form = new FormGroup({
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
  });

  public ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.form.value.startDate = this.getDateOnlyString(
      new Date(currentYear, 0, 1)
    );
    this.form.value.endDate = this.getDateOnlyString(
      new Date(currentYear, 11, 31)
    );
  }

  public close(): void {
    this.closeModal.emit();
  }

  public submit(): void {
    if (this.form.valid) {
      const currentYear = new Date().getFullYear();

      var startDate = this.form.value.startDate;
      if (!startDate) {
        startDate = this.getDateOnlyString(new Date(currentYear, 0, 1));
      }

      var endDate = this.form.value.endDate;
      if (!endDate) {
        endDate = this.getDateOnlyString(new Date(currentYear, 0, 1));
      }

      this.submitModal.emit(
        new AbsenceFilters(new Date(startDate), new Date(endDate))
      );
    }
  }

  private getDateOnlyString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
