import { Component, OnInit } from '@angular/core';
import { Absence } from './absence-list.models';
import { AbsenceFormComponent } from '../absence-form/absence-form.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'absence-list',
  standalone: true,
  imports: [DatePipe, AbsenceFormComponent],
  templateUrl: './absence-list.component.html',
  styleUrl: './absence-list.component.css',
})
export class AbsenceListComponent implements OnInit {
  public absences: Absence[] = [];
  isFormOpened: boolean = false;

  ngOnInit(): void {}

  openForm() {
    this.isFormOpened = true;
  }

  closeForm() {
    this.isFormOpened = false;
  }

  submitForm(absence: Absence) {
    this.absences.push(absence);
    this.closeForm();
  }
}
