import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActivityDto } from './dtos/create-activity.dto';
import { plainToInstance } from 'class-transformer';
import { ActivityResponseDto } from './dtos/activity.dto';

@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async createActivity(req: CreateActivityDto) {
    await this.prismaService.activity.create({ data: req });
  }

  async getActivityByAddress(address: string): Promise<ActivityResponseDto[]> {
    const activities = await this.prismaService.activity.findMany({
      where: {
        userAddress: address,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return plainToInstance(ActivityResponseDto, activities, {
      excludeExtraneousValues: true,
    });
  }

  async getActivities(): Promise<ActivityResponseDto[]> {
    const activities = await this.prismaService.activity.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return plainToInstance(ActivityResponseDto, activities, {
      excludeExtraneousValues: true,
    });
  }
}
