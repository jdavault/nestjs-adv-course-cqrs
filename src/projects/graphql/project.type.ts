import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { ProjectStatus } from '../project.entity';

registerEnumType(ProjectStatus, {
  name: 'ProjectStatus',
  description: 'Project status enum',
});

@ObjectType()
export class ProjectType {
  @Field(() => ID)
  projectId: string;

  @Field(() => ID)
  userId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ProjectStatus)
  status: ProjectStatus;

  @Field({ nullable: true })
  deadline?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class DeleteProjectResponse {
  @Field()
  deleted: boolean;

  @Field()
  projectId: string;
}
