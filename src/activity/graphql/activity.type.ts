import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';

@ObjectType()
export class ActivityLogType {
  @Field(() => ID)
  _id: string;

  @Field()
  userId: string;

  @Field()
  entityType: string;

  @Field()
  entityId: string;

  @Field()
  action: string;

  @Field(() => GraphQLJSON, { nullable: true })
  payload?: Record<string, any>;

  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: Record<string, any>;

  @Field()
  timestamp: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
