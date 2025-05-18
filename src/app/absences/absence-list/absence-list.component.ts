import { Component, OnInit } from '@angular/core';
import {
  AbsenceDTO,
  CreateAbsenceDTO,
  EditAbsenceDTO,
} from '../models/absence-list.models';
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
  public selectedAbsence: AbsenceDTO | null = null;

  public constructor(absenceService: AbsenceService) {
    this.absenceService = absenceService;
  }

  public ngOnInit(): void {
    this.absenceService.getAbsences().subscribe({
      next: (data) => {
        if (data) {
          this.absences = data;
        }
      },
    });
  }

  public openForm(absence?: AbsenceDTO): void {
    this.selectedAbsence = absence ? absence : null;
    this.isFormOpened = true;
  }

  public closeForm(): void {
    this.isFormOpened = false;
  }

  public create(absence: CreateAbsenceDTO): void {
    this.absenceService.addAbsence(absence).subscribe({
      next: (data) => {
        if (data) {
          this.absences.push(
            new AbsenceDTO(
              data,
              absence.name,
              absence.type,
              absence.startDate,
              absence.endDate
            )
          );
        }
      },
    });
    this.closeForm();
  }

  public edit(absence: EditAbsenceDTO): void {
    this.absenceService.editAbsence(absence).subscribe({
      next: (data) => {
        if (data) {
          this.selectedAbsence!.name = absence.name;
          this.selectedAbsence!.type = absence.type;
          this.selectedAbsence!.startDate = absence.startDate;
          this.selectedAbsence!.endDate = absence.endDate;
        }
      },
    });
    this.closeForm();
  }

  public delete(id: number): void {
    this.absenceService.deleteAbsence(id).subscribe({
      next: (data) => {
        if (data) {
          this.absences = this.absences.filter((a) => a.id !== id);
        }
      },
    });
  }
}
