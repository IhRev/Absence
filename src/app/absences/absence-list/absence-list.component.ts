import { Component, OnInit } from '@angular/core';
import {
  Absence,
  AbsenceTypeDTO,
  CreateAbsenceDTO,
  EditAbsenceDTO,
} from '../models/absence.models';
import { AbsenceFormComponent } from '../absence-form/absence-form.component';
import { DatePipe, NgIf } from '@angular/common';
import { AbsenceService } from '../services/absence.service';
import { AbsenceTypeService } from '../services/absence-type.service';
import { AbsenceFiltersComponent } from '../absence-filters/absence-filters.component';
import { AbsenceFilters } from '../models/filters.models';
import { NgClass } from '@angular/common';

@Component({
  selector: 'absence-list',
  standalone: true,
  imports: [
    DatePipe,
    AbsenceFormComponent,
    AbsenceFiltersComponent,
    NgClass,
    NgIf,
  ],
  templateUrl: './absence-list.component.html',
  styleUrl: './absence-list.component.css',
})
export class AbsenceListComponent implements OnInit {
  private static num = 0;
  private types: AbsenceTypeDTO[] | null = null;

  public message: string | null = null;
  public absences: Absence[] = [];
  public isFormOpened: boolean = false;
  public filtersOpened: boolean = false;
  public selectedAbsence: Absence | null = null;
  public isSuccess: boolean = false;
  public isProcessing: boolean = false;

  public constructor(
    private readonly absenceService: AbsenceService,
    private readonly absenceTypeService: AbsenceTypeService
  ) {}

  public ngOnInit(): void {
    this.isProcessing = true;
    this.absenceTypeService.types$.subscribe({
      next: (value) => {
        if (value) {
          this.isProcessing = false;
          this.types = value;
          const currentYear = new Date().getFullYear();
          this.loadAbsences(
            new Date(currentYear, 0, 1),
            new Date(currentYear, 11, 31)
          );
        }
      },
    });
  }

  public openForm(absence?: Absence): void {
    if (this.types) {
      this.selectedAbsence = absence ? absence : null;
      this.isFormOpened = true;
    }
  }

  public closeForm(): void {
    this.isFormOpened = false;
  }

  public create(absence: CreateAbsenceDTO): void {
    if (this.types) {
      this.isProcessing = true;
      this.absenceService.addAbsence(absence).subscribe({
        next: (result) => {
          if (result.isSuccess) {
            if (typeof result.data === 'number') {
              var newAbsence = new Absence(
                ++AbsenceListComponent.num,
                result.data!,
                absence.name,
                this.types!.find((t) => t.id === absence.type)!,
                absence.startDate,
                absence.endDate
              );
              this.absences.push(newAbsence);
            }
            this.isSuccess = true;
          } else {
            this.isSuccess = false;
          }
          this.message = result.message;
        },
      });
      this.closeForm();
    }
  }

  public edit(absence: EditAbsenceDTO): void {
    this.absenceService.editAbsence(absence).subscribe({
      next: (result) => {
        if (result.isSuccess) {
          this.selectedAbsence!.name = absence.name;
          this.selectedAbsence!.type = this.types!.find(
            (t) => t.id === absence.type
          )!;
          this.selectedAbsence!.startDate = absence.startDate;
          this.selectedAbsence!.endDate = absence.endDate;
          this.isSuccess = true;
        } else {
          this.isSuccess = false;
        }
        this.message = result.message;
      },
    });
    this.closeForm();
  }

  public delete(id: number): void {
    this.absenceService.deleteAbsence(id).subscribe({
      next: (result) => {
        if (result.isSuccess) {
          AbsenceListComponent.num = 0;
          this.absences = this.absences.filter((a) => a.id !== id);
          this.absences.forEach((a) => (a.num = ++AbsenceListComponent.num));
          this.isSuccess = true;
        } else {
          this.isSuccess = false;
        }
        this.message = result.message;
      },
    });
  }

  public showFilters(): void {
    if (this.types) {
      this.filtersOpened = true;
    }
  }

  public closeFilters(): void {
    this.filtersOpened = false;
  }

  public applyFilters(filters: AbsenceFilters): void {
    if (this.types) {
      this.loadAbsences(filters.startDate, filters.endDate);
      this.filtersOpened = false;
    }
  }

  private loadAbsences(startDate: Date, endDate: Date): void {
    this.isProcessing = true;
    this.absences = [];
    this.absenceService.getAbsences(startDate, endDate).subscribe({
      next: (result) => {
        if (result.isSuccess) {
          AbsenceListComponent.num = 0;
          result.data!.forEach((a) =>
            this.absences.push(
              new Absence(
                ++AbsenceListComponent.num,
                a.id,
                a.name,
                this.types!.find((t) => t.id === a.type)!,
                a.startDate,
                a.endDate
              )
            )
          );
        } else {
          this.isSuccess = false;
          this.message = result.message;
        }
        this.isProcessing = false;
      },
    });
  }

  public closeMessage(): void {
    this.message = null;
  }
}
