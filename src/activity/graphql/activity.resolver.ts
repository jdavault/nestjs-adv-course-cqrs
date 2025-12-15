import { Resolver, Query, Args, ID, Int } from '@nestjs/graphql';
import { ActivityLogType } from './activity.type';
import { ActivityService } from '../activity.service';

@Resolver(() => ActivityLogType)
export class ActivityResolver {
  constructor(private readonly activityService: ActivityService) {}

  @Query(() => [ActivityLogType], { name: 'activityLogs' })
  async getActivityLogs(
    @Args('userId', { type: () => ID, nullable: true }) userId?: string,
    @Args('entityType', { nullable: true }) entityType?: string,
    @Args('entityId', { type: () => ID, nullable: true }) entityId?: string,
    @Args('action', { nullable: true }) action?: string,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 }) offset?: number,
  ): Promise<ActivityLogType[]> {
    const results = await this.activityService.findAll({
      userId,
      entityType,
      entityId,
      action,
      limit,
      offset,
    });
    return results as unknown as ActivityLogType[];
  }

  @Query(() => [ActivityLogType], { name: 'recentActivity' })
  async getRecentActivity(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 20 }) limit?: number,
  ): Promise<ActivityLogType[]> {
    const results = await this.activityService.getRecentActivity(limit);
    return results as unknown as ActivityLogType[];
  }

  @Query(() => [ActivityLogType], { name: 'activityByUser' })
  async getActivityByUser(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 }) limit?: number,
  ): Promise<ActivityLogType[]> {
    const results = await this.activityService.findByUser(userId, limit);
    return results as unknown as ActivityLogType[];
  }

  @Query(() => [ActivityLogType], { name: 'activityByEntity' })
  async getActivityByEntity(
    @Args('entityType') entityType: string,
    @Args('entityId', { type: () => ID }) entityId: string,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 }) limit?: number,
  ): Promise<ActivityLogType[]> {
    const results = await this.activityService.findByEntity(
      entityType,
      entityId,
      limit,
    );
    return results as unknown as ActivityLogType[];
  }
}
