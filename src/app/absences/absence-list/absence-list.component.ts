import { Component, OnInit } from '@angular/core';
import { AbsenceDTO } from '../models/absence-list.models';
import { AbsenceFormComponent } from '../absence-form/absence-form.component';
import { DatePipe } from '@angular/common';
import { AbsenceService } from '../services/absence.service';

@Component({
  selector: 'absence-list',
  standalone: true,
  imports: [DatePipe, AbsenceFormComponent],
  templateUrl: './absence-list.component.html',
  styleUrl: './absence-list.component.css',
})
export class AbsenceListComponent implements OnInit {
  private readonly absenceService: AbsenceService;

  public absences: AbsenceDTO[] = [];
  public isFormOpened: boolean = false;

  public constructor(absenceService: AbsenceService) {
    this.absenceService = absenceService;
  }

  public ngOnInit(): void {
    this.absenceService.getAbsences().subscribe({
      next: (data) => (this.absences = data),
      error: (e) => console.error(e),
    });
  }

  public openForm(): void {
    this.isFormOpened = true;
  }

  public closeForm(): void {
    this.isFormOpened = false;
  }

  public submitForm(absence: AbsenceDTO): void {
    this.absenceService.addAbsence(absence).subscribe({
      next: (data) => {
        absence.id = data;
        this.absences.push(absence);
      },
      error: (e) => console.error(e),
    });
    this.closeForm();
  }
}
