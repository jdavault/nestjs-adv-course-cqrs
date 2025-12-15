import { Get, Param, Controller, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ActivityService } from './activity.service';

@ApiTags('activity')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all activity logs' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'entityType', required: false, description: 'Filter by entity type (USER, PROJECT, TASK)' })
  @ApiQuery({ name: 'entityId', required: false, description: 'Filter by entity ID' })
  @ApiQuery({ name: 'action', required: false, description: 'Filter by action type' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit results', example: 50 })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset for pagination', example: 0 })
  @ApiResponse({ status: 200, description: 'List of activity logs' })
  async getAllActivity(
    @Query('userId') userId?: string,
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('action') action?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.activityService.findAll({
      userId,
      entityType,
      entityId,
      action,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent activity' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit results', example: 20 })
  @ApiResponse({ status: 200, description: 'Recent activity logs' })
  async getRecentActivity(@Query('limit') limit?: string) {
    return this.activityService.getRecentActivity(
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get activity by user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit results', example: 50 })
  @ApiResponse({ status: 200, description: 'User activity logs' })
  async getActivityByUser(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    return this.activityService.findByUser(
      userId,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Get('entity/:entityType/:entityId')
  @ApiOperation({ summary: 'Get activity for a specific entity' })
  @ApiParam({ name: 'entityType', description: 'Entity type (USER, PROJECT, TASK)' })
  @ApiParam({ name: 'entityId', description: 'Entity ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit results', example: 50 })
  @ApiResponse({ status: 200, description: 'Entity activity logs' })
  async getActivityByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Query('limit') limit?: string,
  ) {
    return this.activityService.findByEntity(
      entityType,
      entityId,
      limit ? parseInt(limit, 10) : undefined,
    );
  }
}
