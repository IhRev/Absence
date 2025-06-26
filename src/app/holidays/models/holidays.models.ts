export class HolidayDTO {
  public constructor(
    public id: number,
    public name: string,
    public date: Date
  ) {}
}

export class CreateHolidayDTO {
  public constructor(
    public name: string,
    public date: Date,
    public organizationId: number
  ) {}
}

export class EditHolidayDTO {
  public constructor(
    public id: number,
    public name: string,
    public date: Date
  ) {}
}

export class Holiday {
  public constructor(
    public num: number,
    public id: number,
    public name: string,
    public date: Date
  ) {}
}
