import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Absence, AbsenceTypeDTO } from '../absence-list/absence-list.models';
import { AbsenceTypeService } from './absence-type.service';

@Component({
  selector: 'app-absence-form',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './absence-form.component.html',
  styleUrl: './absence-form.component.css',
})
export class AbsenceFormComponent implements OnInit {
  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<Absence>();
  @Output() submitModal = new EventEmitter();
  public types: AbsenceTypeDTO[] = [];
  public name: string = 'Absence';
  public selectedType!: AbsenceTypeDTO;
  public startDate: Date = new Date();
  public endDate: Date = new Date();
  private absenceTypeService: AbsenceTypeService;

  constructor(absenceTypeService: AbsenceTypeService) {
    this.absenceTypeService = absenceTypeService;
  }

  ngOnInit(): void {
    this.absenceTypeService.getTypes().subscribe({
      next: (data) => {
        this.types = data;
        this.selectedType = data[0];
      },
      error: (e) => console.log(e),
    });
  }

  close() {
    this.closeModal.emit();
  }

  submit() {
    this.submitModal.emit(
      new Absence(
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
