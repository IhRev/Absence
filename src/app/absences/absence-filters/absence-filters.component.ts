import { Component, inject, OnInit, output, signal } from '@angular/core';
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
import { DateHelper } from '../../common/helpers/date-helper';

@Component({
  selector: 'app-absence-filters',
  standalone: true,
  imports: [
    FormsModule,
    ModalFormComponent,
    ReactiveFormsModule,
    FormErrorComponent,
  ],
  templateUrl: './absence-filters.component.html',
  styleUrls: [
    './absence-filters.component.css',
    '../../common/styles/modal-dialog-styles.css',
  ],
})
export class AbsenceFiltersComponent implements OnInit {
  readonly #organizationsService = inject(OrganizationsService);

  closeModal = output();
  submitModal = output<AbsenceFilters>();
  members = signal<MemberDTO[] | null>(null);
  form = new FormGroup({
    startDate: new FormControl<string>(
      DateHelper.getDateOnlyString(DateHelper.getStartOfTheCurrentYear()),
      [Validators.required]
    ),
    endDate: new FormControl<string>(
      DateHelper.getDateOnlyString(DateHelper.getEndOfTheCurrentYear()),
      [Validators.required]
    ),
    selectedMembers: new FormControl<number[]>([]),
  });

  ngOnInit() {
    const organization = this.#organizationsService.selectedOrganization();
    if (organization && organization.isAdmin) {
      this.#organizationsService.getMembers().subscribe((res) => {
        if (res.isSuccess) {
          this.members.set(res.data!);
        }
      });
    }
  }

  submit() {
    if (this.form.valid) {
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
}
