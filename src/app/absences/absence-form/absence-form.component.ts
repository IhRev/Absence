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
  AbsenceDTO,
  AbsenceTypeDTO,
  CreateAbsenceDTO,
  EditAbsenceDTO,
} from '../models/absence-list.models';
import { AbsenceTypeService } from '../services/absence-type.service';

@Component({
  selector: 'app-absence-form',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './absence-form.component.html',
  styleUrl: './absence-form.component.css',
})
export class AbsenceFormComponent implements OnInit, OnChanges {
  private readonly absenceTypeService: AbsenceTypeService;

  @Input() public isVisible = false;
  @Input() public absence: AbsenceDTO | null = null;
  @Output() public closeModal = new EventEmitter();
  @Output() public submitCreate = new EventEmitter<CreateAbsenceDTO>();
  @Output() public submitEdit = new EventEmitter<EditAbsenceDTO>();

  public types: AbsenceTypeDTO[] = [];
  public name!: string;
  public selectedType!: AbsenceTypeDTO;
  public startDate!: string;
  public endDate!: string;

  public constructor(absenceTypeService: AbsenceTypeService) {
    this.absenceTypeService = absenceTypeService;
  }

  public ngOnInit(): void {
    this.absenceTypeService.getTypes().subscribe({
      next: (data) => {
        if (data) {
          this.types = data;
          this.selectedType = data[0];
        }
      },
    });
  }

  public ngOnChanges(): void {
    if (this.absence) {
      this.name = this.absence.name;
      this.selectedType = this.types.find((t) => t.id === this.absence!.type)!;
      this.startDate = this.absence.startDate.toISOString().split('T')[0];
      this.endDate = this.absence.endDate.toISOString().split('T')[0];
    } else {
      this.name = 'Absence';
      this.selectedType = this.types[0];
      this.startDate = new Date().toISOString().split('T')[0];
      this.endDate = new Date().toISOString().split('T')[0];
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
          new Date(this.endDate)
        )
      );
    }
  }
}
