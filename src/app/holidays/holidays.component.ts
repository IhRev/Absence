import { Component, OnInit } from '@angular/core';
import { HolidayFormComponent } from './holiday-form/holiday-form.component';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
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
  imports: [DatePipe, HolidayFormComponent, NgIf, NgClass, NgFor],
  templateUrl: './holidays.component.html',
  styleUrls: [
    './holidays.component.css',
    '../common/styles/grid-list-styles.css',
  ],
})
export class HolidaysComponent implements OnInit {
  private static num = 0;
  public organization: Organization | null = null;

  public holidays: Holiday[] = [];
  public isFormOpened: boolean = false;
  public selectedHoliday: Holiday | null = null;
  public isProcessing: boolean = false;
  public message: string | null = null;
  public isSuccess: boolean = false;

  public constructor(
    private readonly holidaysService: HolidaysService,
    private readonly organizationService: OrganizationsService
  ) {}

  public ngOnInit(): void {
    this.startProcess();
    this.organizationService.selectedOrganization$.subscribe((value) => {
      if (value) {
        this.isProcessing = false;
        this.organization = value;
        this.loadHolidays();
      }
    });
  }

  public closeMessage(): void {
    this.message = null;
  }

  private startProcess() {
    this.isProcessing = true;
    this.closeMessage();
  }

  private loadHolidays(): void {
    this.startProcess();
    if (this.organization) {
      this.holidaysService.getHolidays(this.organization!.id).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            HolidaysComponent.num = 0;
            this.holidays = res.data!.map(
              (h) => new Holiday(++HolidaysComponent.num, h.id, h.name, h.date)
            );
          } else {
            this.isSuccess = false;
            this.message = res.message;
          }
          this.isProcessing = false;
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
    this.startProcess();
    if (this.organization) {
      this.holidaysService.addHoliday(holiday).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.holidays.push(
              new Holiday(
                ++HolidaysComponent.num,
                res.data!,
                holiday.name,
                holiday.date
              )
            );
            this.message = 'Holiday created successfully!';
          } else {
            this.message = res.message;
          }
          this.isSuccess = res.isSuccess;
          this.isProcessing = false;
        },
      });
      this.closeForm();
    }
  }

  public edit(holiday: EditHolidayDTO): void {
    this.startProcess();
    this.holidaysService.editHoliday(holiday).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.selectedHoliday!.name = holiday.name;
          this.selectedHoliday!.date = holiday.date;
          this.message = 'Holiday edited successfully!';
        } else {
          this.message = res.message;
        }
        this.isSuccess = res.isSuccess;
        this.isProcessing = false;
      },
    });
    this.closeForm();
  }

  public delete(id: number): void {
    this.startProcess();
    this.holidaysService.deleteHoliday(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          HolidaysComponent.num = 0;
          this.holidays = this.holidays.filter((a) => a.id !== id);
          this.holidays.forEach((h) => (h.num = ++HolidaysComponent.num));
          this.message = 'Holiday deleted successfully!';
        } else {
          this.message = res.message;
        }
        this.isSuccess = res.isSuccess;
        this.isProcessing = false;
      },
    });
  }
}
