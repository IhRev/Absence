import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule  } from '@angular/forms';
import { Absence } from '../absence-list/absence-list.models';

@Component({
  selector: 'app-absence-form',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './absence-form.component.html',
  styleUrl: './absence-form.component.css'
})
export class AbsenceFormComponent {
  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<Absence>();
  types: string[] = ['Option 1', 'Option 2', 'Option 3'];
  name: string = 'Absence';
  selectedType: string = this.types[0];
  startDate: string = '';
  endDate: string = '';

  close(){
    this.closeModal.emit(
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