import { InputType, Field, ID } from '@nestjs/graphql';
import { ProjectStatus } from '../project.entity';

@InputType()
export class CreateProjectInput {
  @Field(() => ID)
  userId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ProjectStatus, { nullable: true })
  status?: ProjectStatus;

  @Field({ nullable: true })
  deadline?: Date;
}

@InputType()
export class UpdateProjectInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ProjectStatus, { nullable: true })
  status?: ProjectStatus;

  @Field({ nullable: true })
  deadline?: Date;
}
