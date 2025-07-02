export interface EventTypeDTO {
  id: number;
  name: string;
}

export interface EventDTO {
  id: number;
  absenceId: number | null;
  name: string | null;
  startDate: Date | null;
  endDate: Date | null;
  absenceType: number | null;
  userId: number;
  absenceEventType: number;
}
