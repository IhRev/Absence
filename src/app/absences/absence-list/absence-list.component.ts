import { Component, OnInit } from '@angular/core';
import { Absence } from './absence-list.models';
import { AbsenceFormComponent } from '../absence-form/absence-form.component';
import { NgFor, DatePipe } from '@angular/common';

@Component({
  selector: 'absence-list',
  standalone: true,
  imports: [DatePipe, NgFor, AbsenceFormComponent],
  templateUrl: './absence-list.component.html',
  styleUrl: './absence-list.component.css'
})
export class AbsenceListComponent implements OnInit {
  public absences: Absence[] = [];
  isFormOpened: boolean = false;

  ngOnInit(): void {
    this.isFormOpened = true;
    this.absences.push(new Absence(1, 'Item1', 'Type1', new Date(), new Date(), 1));
    this.absences.push(new Absence(2, 'Item2', 'Type2', new Date(), new Date(), 1));
    this.absences.push(new Absence(3, 'Item3', 'Type3', new Date(), new Date(), 1));
    this.absences.push(new Absence(4, 'Item4', 'Type1', new Date(), new Date(), 1));
    this.absences.push(new Absence(5, 'Item5', 'Type4', new Date(), new Date(), 1));
  }

  openForm() {
    this.isFormOpened = true;
  }

  closeForm(absence: Absence) {
    this.absences.push(absence);
    this.isFormOpened = false;
  }
}