import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Absence,
  AbsenceTypeDTO,
  CreateAbsenceDTO,
  EditAbsenceDTO,
} from '../models/absence.models';
import { AbsenceTypeService } from '../services/absence-type.service';
import { ModalFormComponent } from '../../common/modal-form/modal-form.component';

@Component({
  selector: 'app-absence-form',
  standalone: true,
  imports: [NgFor, FormsModule, ModalFormComponent],
  templateUrl: './absence-form.component.html',
  styleUrl: './absence-form.component.css',
})
export class AbsenceFormComponent implements OnInit, OnChanges {
  private readonly absenceTypeService: AbsenceTypeService;

  @Input() public isVisible = false;
  @Input() public absence: Absence | null = null;
  @Output() public closeModal = new EventEmitter();
  @Output() public submitCreate = new EventEmitter<CreateAbsenceDTO>();
  @Output() public submitEdit = new EventEmitter<EditAbsenceDTO>();

  public types: AbsenceTypeDTO[] = [];
  public name!: string;
  public title!: string;
  public selectedType!: AbsenceTypeDTO;
  public startDate!: string;
  public endDate!: string;
  public message?: string;

  public constructor(absenceTypeService: AbsenceTypeService) {
    this.absenceTypeService = absenceTypeService;
  }

  public ngOnInit(): void {
    this.absenceTypeService.types$.subscribe({
      next: (value) => {
        if (value) {
          this.types = value;
        }
      },
    });
  }

  public ngOnChanges(): void {
    if (this.isVisible) {
      if (this.absence) {
        this.name = this.absence.name;
        this.selectedType = this.types.find(
          (t) => t.id == this.absence?.type.id
        )!;
        this.startDate = this.getDateOnlyString(
          new Date(this.absence.startDate)
        );
        this.endDate = this.getDateOnlyString(new Date(this.absence.endDate));
        this.title = 'Edit';
      } else {
        this.name = 'Absence';
        this.selectedType = this.types[0];
        this.startDate = this.endDate = this.getDateOnlyString(new Date());
        this.title = 'Add';
      }
    }
  }

  public close(): void {
    this.closeModal.emit();
  }

  public submit(): void {
    if (this.absence) {
      this.submitEdit.emit(
        new EditAbsenceDTO(
          this.absence.id,
          this.name,
          this.selectedType.id,
          new Date(this.startDate),
          new Date(this.endDate)
        )
      );
    } else {
      this.submitCreate.emit(
        new CreateAbsenceDTO(
          this.name,
          this.selectedType.id,
          new Date(this.startDate),
          new Date(this.endDate),
          Number(localStorage.getItem('organization'))
        )
      );
    }
  }

  private getDateOnlyString = (date: Date): string =>
    date.toISOString().split('T')[0];
}
