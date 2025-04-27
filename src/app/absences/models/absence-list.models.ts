export class AbsenceDTO {
  constructor(
    public id: number,
    public name: string,
    public type: number,
    public startDate: Date,
    public endDate: Date
  ) {}
}

export class CreateAbsenceDTO {
  constructor(
    public name: string,
    public type: number,
    public startDate: Date,
    public endDate: Date
  ) {}
}

export class EditAbsenceDTO {
  constructor(
    public id: number,
    public name: string,
    public type: number,
    public startDate: Date,
    public endDate: Date
  ) {}
}

export interface AbsenceTypeDTO {
  id: number;
  name: string;
}
