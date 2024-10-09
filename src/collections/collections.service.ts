import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collections } from '@prisma/client';

@Injectable()
export class CollectionsService {
  private readonly logger = new Logger(CollectionsService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async createCollection(dto: CreateCollectionDto) {
    const collection = await this.prismaService.collections.create({
      data: {
        name: dto.name,
        symbol: dto.symbol,
        uri: dto.uri,
        description: dto.description,
        userId: dto.userId,
        address: dto.address,
        totalSupply: dto.totalSupply,
        createdAt: Date.now().toString(),
      },
    });

    this.logger.log(`Collection ${collection.name} created`);
  }
}
