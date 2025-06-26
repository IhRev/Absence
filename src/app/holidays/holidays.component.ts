import { Component, OnInit } from '@angular/core';
import { HolidayFormComponent } from './holiday-form/holiday-form.component';
import { DatePipe, NgIf } from '@angular/common';
import { HolidaysService } from './services/holidays.service';
import {
  CreateHolidayDTO,
  EditHolidayDTO,
  Holiday,
} from './models/holidays.models';
import { OrganizationsService } from '../organizations/services/organizations.service';
import { Organization } from '../organizations/models/organizations.models';

@Component({
  selector: 'app-holidays',
  standalone: true,
  imports: [DatePipe, HolidayFormComponent, NgIf],
  templateUrl: './holidays.component.html',
  styleUrl: './holidays.component.css',
})
export class HolidaysComponent implements OnInit {
  private static num = 0;
  private readonly holidaysService: HolidaysService;
  private readonly organizationService: OrganizationsService;
  public organization: Organization | null = null;

  public holidays: Holiday[] = [];
  public isFormOpened: boolean = false;
  public selectedHoliday: Holiday | null = null;

  public constructor(
    holidaysService: HolidaysService,
    organizationService: OrganizationsService
  ) {
    this.holidaysService = holidaysService;
    this.organizationService = organizationService;
  }

  public ngOnInit(): void {
    this.organizationService.selectedOrganization$.subscribe((value) => {
      if (value) {
        this.organization = value;
        this.loadHolidays();
      }
    });
  }

  private loadHolidays(): void {
    if (this.organization) {
      this.holidaysService.getHolidays(this.organization!.id).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            HolidaysComponent.num = 0;
            this.holidays = res.data!.map(
              (h) => new Holiday(++HolidaysComponent.num, h.id, h.name, h.date)
            );
          }
        },
      });
    }
  }

  public openForm(holiday?: Holiday): void {
    if (this.organization) {
      this.selectedHoliday = holiday ? holiday : null;
      this.isFormOpened = true;
    }
  }

  public closeForm(): void {
    this.isFormOpened = false;
  }

  public create(holiday: CreateHolidayDTO): void {
    if (this.organization) {
      this.holidaysService.addHoliday(holiday).subscribe({
        next: (data) => {
          if (data.isSuccess) {
            this.holidays.push(
              new Holiday(
                ++HolidaysComponent.num,
                data.data!,
                holiday.name,
                holiday.date
              )
            );
          }
        },
      });
      this.closeForm();
    }
  }

  public edit(holiday: EditHolidayDTO): void {
    this.holidaysService.editHoliday(holiday).subscribe({
      next: (data) => {
        if (data.isSuccess) {
          this.selectedHoliday!.name = holiday.name;
          this.selectedHoliday!.date = holiday.date;
        }
      },
    });
    this.closeForm();
  }

  public delete(id: number): void {
    this.holidaysService.deleteHoliday(id).subscribe({
      next: (data) => {
        if (data.isSuccess) {
          HolidaysComponent.num = 0;
          this.holidays = this.holidays.filter((a) => a.id !== id);
          this.holidays.forEach((h) => (h.num = ++HolidaysComponent.num));
        }
      },
    });
  }
}
