import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString, IsNumber, IsDate } from 'class-validator';

export class ActivityResponseDto {
  @ApiProperty({ example: 'BUY', description: 'Action type' })
  @IsString()
  @Expose()
  action: string;

  @ApiProperty({
    example: 'Bought an NFT',
    description: 'Description of the action',
  })
  @IsString()
  @Expose()
  description: string;

  @ApiProperty({ example: 0.25, description: 'Price of the NFT' })
  @IsNumber()
  @Expose()
  price: number;

  @ApiProperty({
    example: new Date(),
    description: 'Timestamp of the activity',
  })
  @IsDate()
  @Type(() => Date)
  @Expose()
  createdAt: Date;
}
