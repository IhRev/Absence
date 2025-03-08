import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Absence } from '../absence-list/absence-list.models';

@Component({
  selector: 'app-absence-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
  ],
  templateUrl: './absence-form.component.html',
  styleUrl: './absence-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbsenceFormComponent {
  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<Absence>();
  @Output() submitModal = new EventEmitter();
  types: string[] = ['Option 1', 'Option 2', 'Option 3'];
  name: string = 'Absence';
  selectedType: string = this.types[0];
  startDate: string = '';
  endDate: string = '';

  close() {
    this.closeModal.emit();
  }

  submit() {
    this.submitModal.emit(
      new Absence(
        0,
        this.name,
        this.selectedType,
        new Date(this.startDate),
        new Date(this.endDate),
        1
      )
    );
  }
}
