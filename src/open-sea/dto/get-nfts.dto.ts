import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetNftsDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  collection: string;
}
