import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AbsenceDTO,
  AbsenceTypeDTO,
} from '../absence-list/absence-list.models';
import { AbsenceTypeService } from './absence-type.service';

@Component({
  selector: 'app-absence-form',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './absence-form.component.html',
  styleUrl: './absence-form.component.css',
})
export class AbsenceFormComponent implements OnInit {
  private readonly absenceTypeService: AbsenceTypeService;

  @Input() public isVisible = false;
  @Output() public closeModal = new EventEmitter<AbsenceDTO>();
  @Output() public submitModal = new EventEmitter();

  public types: AbsenceTypeDTO[] = [];
  public name: string = 'Absence';
  public selectedType!: AbsenceTypeDTO;
  public startDate: Date = new Date();
  public endDate: Date = new Date();

  public constructor(absenceTypeService: AbsenceTypeService) {
    this.absenceTypeService = absenceTypeService;
  }

  public ngOnInit(): void {
    this.absenceTypeService.getTypes().subscribe({
      next: (data) => {
        this.types = data;
        this.selectedType = data[0];
      },
      error: (e) => console.error(e),
    });
  }

  public close(): void {
    this.closeModal.emit();
  }

  public submit(): void {
    this.submitModal.emit(
      new AbsenceDTO(
        0,
        this.name,
        this.selectedType,
        this.startDate,
        this.endDate,
        1
      )
    );
  }
}
