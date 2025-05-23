import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HolidaysDTO } from '../models/holidays.models';

@Component({
  selector: 'app-holiday-form',
  standalone: true,
  imports: [],
  templateUrl: './holiday-form.component.html',
  styleUrl: './holiday-form.component.css',
})
export class HolidayFormComponent {
  @Input() public isVisible = false;
  @Input() public holiday: HolidaysDTO | null = null;
  @Output() public closeModal = new EventEmitter();
  @Output() public submitCreate = new EventEmitter<HolidaysDTO>();
  @Output() public submitEdit = new EventEmitter<HolidaysDTO>();
}
