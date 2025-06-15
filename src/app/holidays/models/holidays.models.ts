export class HolidayDTO {
  public constructor(
    public id: number,
    public name: string,
    public startDate: Date,
    public endDate: Date
  ) {}
}

export class CreateHolidayDTO {
  public constructor(
    public name: string,
    public startDate: Date,
    public endDate: Date,
    public organizationId: number
  ) {}
}

export class EditHolidayDTO {
  public constructor(
    public id: number,
    public name: string,
    public startDate: Date,
    public endDate: Date
  ) {}
}
