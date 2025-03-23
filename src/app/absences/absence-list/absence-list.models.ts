export class Absence {
  constructor(
    public id: number,
    public name: string,
    public type: AbsenceTypeDTO,
    public startDate: Date,
    public endDate: Date,
    public userId: number
  ) {}
}

export interface AbsenceTypeDTO {
  id: number;
  name: string;
}
