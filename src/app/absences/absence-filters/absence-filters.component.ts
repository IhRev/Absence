import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbsenceFilters } from '../models/filters.models';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-absence-filters',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './absence-filters.component.html',
  styleUrl: './absence-filters.component.css',
})
export class AbsenceFiltersComponent implements OnInit {
  @Input() public isVisible = false;
  @Output() public closeModal = new EventEmitter();
  @Output() public submitModal = new EventEmitter<AbsenceFilters>();

  public startDate!: string;
  public endDate!: string;

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.startDate = this.getDateOnlyString(new Date(currentYear, 0, 1));
    this.endDate = this.getDateOnlyString(new Date(currentYear, 11, 31));
  }

  public close(): void {
    this.closeModal.emit();
  }

  public submit(): void {
    this.submitModal.emit(
      new AbsenceFilters(new Date(this.startDate), new Date(this.endDate))
    );
  }

  private getDateOnlyString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
