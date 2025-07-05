export interface EventTypeDTO {
  id: number;
  name: string;
}

export interface EventDTO {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  absenceType: number;
  userId: number;
  absenceEventType: number;
}

export class Event {
  public constructor(
    public num: number,
    public id: number,
    public name: string,
    public startDate: Date,
    public endDate: Date,
    public absenceType: string,
    public user: string,
    public type: string
  ) {}
}
