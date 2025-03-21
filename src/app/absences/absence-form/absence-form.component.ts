import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Absence } from '../absence-list/absence-list.models';

@Component({
  selector: 'app-absence-form',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './absence-form.component.html',
  styleUrl: './absence-form.component.css',
})
export class AbsenceFormComponent {
  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<Absence>();
  @Output() submitModal = new EventEmitter();
  types: string[] = ['Option 1', 'Option 2', 'Option 3'];
  name: string = 'Absence';
  selectedType: string = this.types[0];
  startDate: Date = new Date();
  endDate: Date = new Date();

  close() {
    this.closeModal.emit();
  }

  submit() {
    this.submitModal.emit(
      new Absence(
        0,
        this.name,
        this.selectedType,
        this.startDate,
        this.endDate,
        1
      )
    );
  }
}
