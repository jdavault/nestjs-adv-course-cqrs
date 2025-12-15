import { AggregateRoot as CqrsAggregateRoot } from '@nestjs/cqrs';
import { IDomainEvent } from './interfaces/domain-event.interface';

export abstract class AggregateRoot extends CqrsAggregateRoot {
  private _version: number = 0;

  get version(): number {
    return this._version;
  }

  set version(value: number) {
    this._version = value;
  }

  protected applyChange(event: IDomainEvent): void {
    this.apply(event);
  }
}
