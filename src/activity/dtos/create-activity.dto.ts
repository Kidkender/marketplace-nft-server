import { ActivityAction } from '@prisma/client';

export class CreateActivityDto {
  userAddress: string;
  action: ActivityAction;
  description: string;
  price: number;
}
