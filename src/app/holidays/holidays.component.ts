import { Component, OnInit } from '@angular/core';
import { HolidayFormComponent } from './holiday-form/holiday-form.component';
import { DatePipe } from '@angular/common';
import { HolidaysService } from './services/holidays.service';
import {
  CreateHolidayDTO,
  EditHolidayDTO,
  HolidayDTO,
} from './models/holidays.models';

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

  public holidays: HolidayDTO[] = [];
  public isFormOpened: boolean = false;
  public selectedHoliday: HolidayDTO | null = null;

  public constructor(holidaysService: HolidaysService) {
    this.holidaysService = holidaysService;
  }

  public ngOnInit(): void {}

  public openForm(holiday?: HolidayDTO): void {
    this.selectedHoliday = holiday ? holiday : null;
    this.isFormOpened = true;
  }

  public closeForm(): void {
    this.isFormOpened = false;
  }

  public create(holiday: CreateHolidayDTO): void {
    this.holidaysService.addHoliday(holiday).subscribe({
      next: (data) => {
        if (data.isSuccess) {
          this.holidays.push(
            new HolidayDTO(data.data!, holiday.name, holiday.date)
          );
        }
      },
    });
    this.closeForm();
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
          this.holidays = this.holidays.filter((a) => a.id !== id);
        }
      },
    });
  }
}
