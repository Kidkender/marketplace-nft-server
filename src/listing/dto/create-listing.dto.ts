import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateListingDto {
  @IsInt()
  tokenId: number;

  @IsString()
  name: string;

  @IsString()
  collectionAddress: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  imageUrl: string;

  @IsString()
  wallet: string;
}
