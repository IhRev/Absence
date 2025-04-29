export interface UserDetails {
  firstName: string;
  lastName: string;
}

export class UserCredentials {
  constructor(public email: string, public password: string) {}
}

export class RegisterDTO {
  constructor(
    public firstName: string,
    public lastName: string,
    public credentials: UserCredentials
  ) {}
}
