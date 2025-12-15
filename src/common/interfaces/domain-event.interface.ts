export interface IDomainEvent {
  readonly eventType: string;
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly timestamp: Date;
  readonly version: number;
  readonly payload: Record<string, any>;
  readonly correlationId?: string;
  readonly causationId?: string;
}

export enum AggregateType {
  USER = 'USER',
  PROJECT = 'PROJECT',
  TASK = 'TASK',
}

export enum ActionType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  ASSIGNED = 'ASSIGNED',
  UNASSIGNED = 'UNASSIGNED',
}
