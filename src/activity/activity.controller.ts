import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActivityResponseDto } from './dtos/activity.dto';
import { ActivityService } from './activity.service';

@ApiTags('Activity')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all activities' })
  @ApiResponse({
    status: 200,
    description: 'List of activities',
    type: [ActivityResponseDto],
  })
  async getAllActivities(): Promise<ActivityResponseDto[]> {
    return this.activityService.getActivities();
  }

  @Get(':address')
  @ApiOperation({ summary: 'Get activities by user address' })
  @ApiParam({ name: 'address', description: 'User wallet address' })
  @ApiResponse({ status: 200, type: [ActivityResponseDto] })
  async getActivityByAddress(
    @Param('address') address: string,
  ): Promise<ActivityResponseDto[]> {
    return this.activityService.getActivityByAddress(address);
  }
}
