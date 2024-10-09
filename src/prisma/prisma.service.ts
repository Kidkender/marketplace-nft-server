import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  cleanDatabase() {
    this.$transaction([
      this.user.deleteMany(),
      this.nFT.deleteMany(),
      this.nFTOwners.deleteMany(),
      this.transaction.deleteMany(),
      this.collections.deleteMany(),
    ]);
  }
}
