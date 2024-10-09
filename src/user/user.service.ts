import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getUserByAddress(address: string): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: { address },
    });

    if (!user) {
      throw new BadRequestException(`User address ${address} not found`);
    }
    return user;
  }

  async createUser(address: string) {
    const user = await this.getUserByAddress(address);
    if (user) {
      throw new BadRequestException(`User already exists`);
    }

    const newUser = await this.prismaService.user.create({ data: { address } });
    this.logger.log(`User ${newUser.id} with address ${address} created `);
  }
}
