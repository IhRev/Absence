import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbsenceFilters } from '../models/filters.models';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalFormComponent } from '../../common/modal-form/modal-form.component';
import { FormErrorComponent } from '../../common/form-error/form-error.component';
import { OrganizationsService } from '../../organizations/services/organizations.service';
import { MemberDTO } from '../../organizations/models/organizations.models';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-absence-filters',
  standalone: true,
  imports: [
    FormsModule,
    ModalFormComponent,
    ReactiveFormsModule,
    FormErrorComponent,
    NgIf,
    NgFor,
  ],
  templateUrl: './absence-filters.component.html',
  styleUrls: [
    './absence-filters.component.css',
    '../../common/styles/modal-dialog-styles.css',
  ],
})
export class AbsenceFiltersComponent implements OnInit {
  private currentYear = new Date().getFullYear();
  @Input() public isVisible = false;
  @Output() public closeModal = new EventEmitter();
  @Output() public submitModal = new EventEmitter<AbsenceFilters>();
  public members: MemberDTO[] | null = null;

  public form = new FormGroup({
    startDate: new FormControl<string>(
      this.getDateOnlyString(new Date(this.currentYear, 0, 1)),
      [Validators.required]
    ),
    endDate: new FormControl<string>(
      this.getDateOnlyString(new Date(this.currentYear, 11, 31)),
      [Validators.required]
    ),
    selectedMembers: new FormControl<number[]>([]),
  });

  constructor(private readonly organizationsService: OrganizationsService) {}

  public ngOnInit(): void {
    this.organizationsService.selectedOrganization$.subscribe((value) => {
      if (value && value.isAdmin) {
        this.organizationsService.getMembers().subscribe((res) => {
          if (res.isSuccess) {
            this.members = res.data!;
          }
        });
      }
    });
  }

  public close(): void {
    this.closeModal.emit();
  }

  public submit(): void {
    if (this.form.valid) {
      const currentYear = new Date().getFullYear();

      var startDate = this.form.value.startDate;
      var endDate = this.form.value.endDate;

      var selectedMembers = this.form.value.selectedMembers;
      var memebers: number[] | null = null;
      if (selectedMembers) {
        memebers = selectedMembers.map((m) => Number(m));
      }

      this.submitModal.emit(
        new AbsenceFilters(new Date(startDate!), new Date(endDate!), memebers)
      );
    }
  }

  private getDateOnlyString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
