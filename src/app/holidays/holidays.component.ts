import { Component, OnInit } from '@angular/core';
import { HolidayFormComponent } from './holiday-form/holiday-form.component';
import { DatePipe } from '@angular/common';
import { HolidaysService } from './services/holidays.service';
import { HolidaysDTO } from './models/holidays.models';

@Component({
  selector: 'app-holidays',
  standalone: true,
  imports: [DatePipe, HolidayFormComponent],
  templateUrl: './holidays.component.html',
  styleUrl: './holidays.component.css',
})
export class HolidaysComponent implements OnInit {
  private static num = 0;
  private readonly holidaysService: HolidaysService;

  public holidays: HolidaysDTO[] = [];
  public isFormOpened: boolean = false;
  public selectedHoliday: HolidaysDTO | null = null;

  public constructor(holidaysService: HolidaysService) {
    this.holidaysService = holidaysService;
  }

  public ngOnInit(): void {}

  public openForm(holiday?: HolidaysDTO): void {
    this.selectedHoliday = holiday ? holiday : null;
    this.isFormOpened = true;
  }

  public closeForm(): void {
    this.isFormOpened = false;
  }

  public create(holiday: HolidaysDTO): void {
    this.holidaysService.addHoliday(holiday).subscribe({
      next: (data) => {
        if (data) {
          holiday.id = data;
          this.holidays.push(holiday);
        }
      },
    });
    this.closeForm();
  }

  public edit(holiday: HolidaysDTO): void {
    this.holidaysService.editHoliday(holiday).subscribe({
      next: (data) => {
        if (data) {
          this.selectedHoliday!.name = holiday.name;
          this.selectedHoliday!.startDate = holiday.startDate;
          this.selectedHoliday!.endDate = holiday.endDate;
        }
      },
    });
    this.closeForm();
  }

  public delete(id: number): void {
    this.holidaysService.deleteHoliday(id).subscribe({
      next: (data) => {
        if (data) {
          this.holidays = this.holidays.filter((a) => a.id !== id);
        }
      },
    });
  }
}
