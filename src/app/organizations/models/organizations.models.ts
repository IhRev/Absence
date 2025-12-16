export interface OrganizationDTO {
  id: number;
  name: string;
  isAdmin: boolean;
  isOwner: boolean;
}

export class CreateOrganizationDTO {
  public constructor(public name: string) {}
}

export class EditOrganizationDTO {
  public constructor(public id: number, public name: string) {}
}

export class Organization {
  public constructor(
    public id: number,
    public name: string,
    public isAdmin: boolean,
    public isOwner: boolean
  ) {}
}

export class MemberDTO {
  public constructor(
    public id: number,
    public fullName: string,
    public isAdmin: boolean,
    public isOwner: boolean
  ) {}
}

export class DeleteOrganizationRequest {
  public constructor(public password: string) {}
}
