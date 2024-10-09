import { IsEthereumAddress, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEthereumAddress()
  address: string;
}
