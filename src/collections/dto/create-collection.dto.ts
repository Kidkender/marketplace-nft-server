import {
  IsEthereumAddress,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateCollectionDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  symbol: string;

  @IsNotEmpty()
  @IsUrl()
  uri: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber()
  totalSupply?: number;

  @IsNotEmpty()
  @IsEthereumAddress()
  address: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
