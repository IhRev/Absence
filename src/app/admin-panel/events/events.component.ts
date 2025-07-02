import { Component, OnInit } from '@angular/core';
import { EventTypesService } from '../services/event-types.service';
import { EventDTO, EventTypeDTO } from '../models/events.models';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnInit {
  private types: EventTypeDTO[] | null = null;
  private events: EventDTO[] = [];

  public constructor(
    private readonly typesService: EventTypesService,
    private readonly eventsService: EventsService
  ) {}

  public ngOnInit(): void {
    this.typesService.types$.subscribe({
      next: (value) => {
        if (value) {
          this.types = value;
          this.load();
        }
      },
    });
  }

  private load() {
    this.eventsService.getEvents().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.events = res.data!;
        }
      },
    });
  }

  public respond(id: number, accepted: boolean) {
    this.eventsService.respond(id, accepted).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.events = this.events.filter((t) => t.id === id);
        }
      },
    });
  }
}
