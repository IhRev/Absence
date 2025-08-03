export class Invitation {
  public constructor(
    public num: number,
    public id: number,
    public organization: string,
    public inviter: string
  ) {}
}
