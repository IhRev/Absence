import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common'
import { AbsenceItem } from './absence-item.model'

@Component({
  selector: 'absence-item',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './absence-item.component.html',
  styleUrl: './absence-item.component.css'
})
export class AbsenceItemComponent {
  @Input() item!: AbsenceItem;
}
