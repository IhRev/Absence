export interface OrganizationDTO {
  id: number;
  name: string;
  isAdmin: boolean;
  isOwner: boolean;
}

export class CreateOrganizationDTO {
  public constructor(public name: string) {}
}

export class Organization {
  public constructor(
    public id: number,
    public name: string,
    public isAdmin: boolean,
    public isOwner: boolean
  ) {}
}

export interface MemberDTO {
  id: number;
  fullName: string;
}
