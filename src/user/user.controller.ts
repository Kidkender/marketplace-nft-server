import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createNewUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto.address);
  }
}
