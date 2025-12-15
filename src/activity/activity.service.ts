import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityLog, ActivityLogDocument } from './schemas/activity-log.schema';

export interface CreateActivityLogDto {
  userId: string;
  entityType: string;
  entityId: string;
  action: string;
  payload?: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp?: Date;
}

export interface ActivityQueryOptions {
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(ActivityLog.name)
    private activityLogModel: Model<ActivityLogDocument>,
  ) {}

  async log(data: CreateActivityLogDto): Promise<ActivityLog> {
    const activityLog = new this.activityLogModel({
      ...data,
      timestamp: data.timestamp || new Date(),
    });
    return activityLog.save();
  }

  async findAll(options: ActivityQueryOptions = {}): Promise<ActivityLog[]> {
    const { userId, entityType, entityId, action, limit = 50, offset = 0 } = options;

    const query: any = {};

    if (userId) query.userId = userId;
    if (entityType) query.entityType = entityType;
    if (entityId) query.entityId = entityId;
    if (action) query.action = action;

    return this.activityLogModel
      .find(query)
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async findByUser(userId: string, limit = 50): Promise<ActivityLog[]> {
    return this.activityLogModel
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  async findByEntity(
    entityType: string,
    entityId: string,
    limit = 50,
  ): Promise<ActivityLog[]> {
    return this.activityLogModel
      .find({ entityType, entityId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  async getRecentActivity(limit = 20): Promise<ActivityLog[]> {
    return this.activityLogModel
      .find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }
}
