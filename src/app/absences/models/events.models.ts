export interface AbsenceEventDTO {
  id: number;
  absenceId: number | null;
  name: string | string;
  startDate: Date | null;
  endDate: Date | null;
  absenceType: number | null;
  userId: number;
  absenceEventType: number;
}

export interface AbsenceEventTypeDTO {
  id: number;
  name: string | string;
}

export class AbsenceEvent {
  constructor(
    id: number,
    name: string | string,
    startDate: Date | null,
    endDate: Date | null,
    absenceType: number | null,
    userId: number,
    absenceEventType: string
  ) {}
}
