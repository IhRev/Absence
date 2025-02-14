import { Component, OnInit } from '@angular/core';
import { AbsenceItemComponent } from '../absence-item/absence-item.component';
import { AbsenceItem } from '../absence-item/absence-item.model';
import { NgFor } from '@angular/common';

@Component({
  selector: 'absence-list',
  standalone: true,
  imports: [AbsenceItemComponent, NgFor],
  templateUrl: './absence-list.component.html',
  styleUrl: './absence-list.component.css'
})
export class AbsenceListComponent implements OnInit {
  public absences: AbsenceItem[] = [];

  ngOnInit(): void {
    this.absences.push(new AbsenceItem(1, 'Item1', 'Type1', new Date(), new Date(), 1));
    this.absences.push(new AbsenceItem(2, 'Item2', 'Type2', new Date(), new Date(), 1));
    this.absences.push(new AbsenceItem(3, 'Item3', 'Type3', new Date(), new Date(), 1));
    this.absences.push(new AbsenceItem(4, 'Item4', 'Type1', new Date(), new Date(), 1));
    this.absences.push(new AbsenceItem(5, 'Item5', 'Type4', new Date(), new Date(), 1));
  }
}