export interface InvitationDTO {
  id: number;
  organization: string;
  inviter: string;
}

export class InviteUserToOrganizationDTO {
  constructor(public userEmail: string, public organizationId: number) {}
}
