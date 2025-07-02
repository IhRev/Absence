import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventTypeDTO } from '../models/events.models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventTypesService {
  private types = new BehaviorSubject<EventTypeDTO[] | null>(null);
  public types$: Observable<EventTypeDTO[] | null> = this.types.asObservable();

  public constructor(private readonly client: HttpClient) {
    this.load();
  }

  private load(): void {
    this.client
      .get<EventTypeDTO[]>('http://192.168.0.179:5081/absences/event_types')
      .subscribe({
        next: (res: EventTypeDTO[]) => {
          this.types.next(res);
        },
        error: (e) => {
          console.error(e);
          this.types.next(null);
        },
      });
  }
}
