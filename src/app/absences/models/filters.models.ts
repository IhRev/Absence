export class AbsenceFilters {
  public constructor(
    public startDate: Date,
    public endDate: Date,
    public membersIds: number[] | null
  ) {}
}
