export class HolidaysDTO {
  public constructor(
    public id: number,
    public name: string,
    public startDate: Date,
    public endDate: Date
  ) {}
}
