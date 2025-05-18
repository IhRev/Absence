import { Component, OnInit } from '@angular/core';
import {
  Absence,
  AbsenceTypeDTO,
  CreateAbsenceDTO,
  EditAbsenceDTO,
} from '../models/absence-list.models';
import { AbsenceFormComponent } from '../absence-form/absence-form.component';
import { DatePipe } from '@angular/common';
import { AbsenceService } from '../services/absence.service';
import { AbsenceTypeService } from '../services/absence-type.service';

@Component({
  selector: 'absence-list',
  standalone: true,
  imports: [DatePipe, AbsenceFormComponent],
  templateUrl: './absence-list.component.html',
  styleUrl: './absence-list.component.css',
})
export class AbsenceListComponent implements OnInit {
  private static num = 0;
  private readonly absenceService: AbsenceService;
  private readonly absenceTypeService: AbsenceTypeService;
  private types: AbsenceTypeDTO[] = [];

  public absences: Absence[] = [];
  public isFormOpened: boolean = false;
  public selectedAbsence: Absence | null = null;

  public constructor(
    absenceService: AbsenceService,
    absenceTypeService: AbsenceTypeService
  ) {
    this.absenceService = absenceService;
    this.absenceTypeService = absenceTypeService;
  }

  public ngOnInit(): void {
    this.absenceTypeService.getTypes().subscribe({
      next: (data) => {
        if (data) {
          this.types = data;
        }
      },
    });
    this.absenceService.getAbsences().subscribe({
      next: (data) => {
        if (data) {
          data.forEach((a) => {
            this.absences.push(
              new Absence(
                ++AbsenceListComponent.num,
                a.id,
                a.name,
                this.types.find((t) => t.id === a.type)!,
                a.startDate,
                a.endDate
              )
            );
          });
        }
      },
    });
  }

  public openForm(absence?: Absence): void {
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
            new Absence(
              ++AbsenceListComponent.num,
              data,
              absence.name,
              (this.selectedAbsence!.type = this.types.find(
                (t) => t.id === absence.type
              )!),
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
          this.selectedAbsence!.type = this.types.find(
            (t) => t.id === absence.type
          )!;
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
