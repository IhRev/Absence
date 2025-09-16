import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { NgFor } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  Absence,
  AbsenceTypeDTO,
  CreateAbsenceDTO,
  EditAbsenceDTO,
} from '../models/absence.models';
import { AbsenceTypeService } from '../services/absence-type.service';
import { ModalFormComponent } from '../../common/modal-form/modal-form.component';
import { FormErrorComponent } from '../../common/form-error/form-error.component';

@Component({
  selector: 'app-absence-form',
  standalone: true,
  imports: [
    NgFor,
    FormsModule,
    ModalFormComponent,
    ReactiveFormsModule,
    FormErrorComponent,
  ],
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

  public title!: string;
  public message!: string;
  public types: AbsenceTypeDTO[] = [];
  public form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
    selectedType: new FormControl<number>(1, [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
  });

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
        this.form.setValue({
          name: this.absence.name,
          selectedType: this.absence?.type.id,
          startDate: this.getDateOnlyString(new Date(this.absence.startDate)),
          endDate: this.getDateOnlyString(new Date(this.absence.endDate)),
        });
        this.title = 'Edit';
      } else {
        this.form.setValue({
          name: 'Absence',
          selectedType: this.types[0].id,
          startDate: this.getDateOnlyString(new Date()),
          endDate: this.getDateOnlyString(new Date()),
        });
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
          this.form.controls.name.value!,
          this.form.controls.selectedType.value!,
          new Date(this.form.controls.startDate.value!),
          new Date(this.form.controls.endDate.value!)
        )
      );
    } else {
      this.submitCreate.emit(
        new CreateAbsenceDTO(
          this.form.controls.name.value!,
          this.form.controls.selectedType.value!,
          new Date(this.form.controls.startDate.value!),
          new Date(this.form.controls.endDate.value!),
          Number(localStorage.getItem('organization'))
        )
      );
    }
  }

  private getDateOnlyString = (date: Date): string =>
    date.toISOString().split('T')[0];
}
