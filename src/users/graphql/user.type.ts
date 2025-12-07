import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => ID)
  userId: string;

  @Field()
  username: string;

  @Field()
  email: string;
}

@ObjectType()
export class DeleteUserResponse {
  @Field()
  deleted: boolean;

  @Field()
  userId: string;
}
