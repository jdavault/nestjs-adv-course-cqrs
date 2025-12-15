export class ProjectDeletedEvent {
  constructor(
    public readonly projectId: string,
    public readonly userId: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
