import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CreateHolidayDTO,
  EditHolidayDTO,
  Holiday,
  HolidayDTO,
} from '../models/holidays.models';

@Component({
  selector: 'app-holiday-form',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './holiday-form.component.html',
  styleUrl: './holiday-form.component.css',
})
export class HolidayFormComponent implements OnChanges {
  @Input() public isVisible = false;
  @Input() public holiday: Holiday | null = null;
  @Output() public closeModal = new EventEmitter();
  @Output() public submitCreate = new EventEmitter<CreateHolidayDTO>();
  @Output() public submitEdit = new EventEmitter<EditHolidayDTO>();

  public name!: string;
  public date!: string;
  public message?: string;

  public ngOnChanges(): void {
    if (this.isVisible) {
      if (this.holiday) {
        this.name = this.holiday.name;
        this.date = this.getDateOnlyString(new Date(this.holiday.date));
      } else {
        this.name = 'Holiday';
        this.date = this.getDateOnlyString(new Date());
      }
    }
  }

  public close(): void {
    this.closeModal.emit();
  }

  public submit(): void {
    if (this.holiday) {
      this.submitEdit.emit(
        new EditHolidayDTO(this.holiday.id, this.name, new Date(this.date))
      );
    } else {
      this.submitCreate.emit(
        new CreateHolidayDTO(
          this.name,
          new Date(this.date),
          Number(localStorage.getItem('organization')!)
        )
      );
    }
  }

  private getDateOnlyString = (date: Date): string =>
    date.toISOString().split('T')[0];
}
