export class UpdateUserCommand {
  constructor(
    public readonly userId: string,
    public readonly data: {
      email?: string;
      username?: string;
      password?: string;
    },
  ) {}
}
