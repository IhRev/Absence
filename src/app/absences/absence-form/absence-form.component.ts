import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-absence-form',
  standalone: true,
  imports: [NgIf],
  templateUrl: './absence-form.component.html',
  styleUrl: './absence-form.component.css'
})
export class AbsenceFormComponent {
  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter();

  close(){
    this.closeModal.emit();
  }
}