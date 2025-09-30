import { Component, OnInit } from '@angular/core';
import { EventTypesService } from '../services/event-types.service';
import { EventTypeDTO, Event } from '../models/events.models';
import { EventsService } from '../services/events.service';
import { DatePipe, NgIf } from '@angular/common';
import { AbsenceTypeService } from '../../absences/services/absence-type.service';
import { AbsenceTypeDTO } from '../../absences/models/absence.models';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [NgIf, DatePipe],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnInit {
  private static num = 0;
  private eventTypes: EventTypeDTO[] | null = null;
  private absenceTypes: AbsenceTypeDTO[] | null = null;
  public events: Event[] = [];

  public constructor(
    private readonly typesService: EventTypesService,
    private readonly eventsService: EventsService,
    private readonly absenceTypeService: AbsenceTypeService
  ) {}

  public ngOnInit(): void {
    this.typesService.types$.subscribe({
      next: (eventTypes) => {
        if (eventTypes) {
          this.eventTypes = eventTypes;
          this.absenceTypeService.types$.subscribe({
            next: (absenceTypes) => {
              if (absenceTypes) {
                this.absenceTypes = absenceTypes;
                this.load();
              }
            },
          });
        }
      },
    });
  }

  private load() {
    if (this.absenceTypes && this.eventTypes) {
      this.eventsService.getEvents().subscribe({
        next: (res) => {
          if (res.isSuccess) {
            EventsComponent.num = 0;
            this.events = res.data!.map(
              (e) =>
                new Event(
                  ++EventsComponent.num,
                  e.id,
                  e.name,
                  e.startDate,
                  e.endDate,
                  this.absenceTypes!.find((t) => t.id === e.absenceType)!.name,
                  e.userId.toString(),
                  this.eventTypes!.find(
                    (t) => t.id === e.absenceEventType
                  )!.name
                )
            );
          }
        },
      });
    }
  }

  public respond(id: number, accepted: boolean) {
    this.eventsService.respond(id, accepted).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.events = this.events.filter((t) => t.id != id);
          EventsComponent.num = 0;
          this.events.forEach((a) => (a.num = ++EventsComponent.num));
        }
      },
    });
  }
}
