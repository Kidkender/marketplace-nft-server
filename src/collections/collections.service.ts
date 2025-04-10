import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collections, Prisma } from '@prisma/client';

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

  async createMultiCollection(data: Prisma.CollectionsCreateManyInput[]) {
    const collections = await this.prismaService.collections.createMany({
      data: data,
      skipDuplicates: true,
    });
    this.logger.log(`${collections.count} Collection created`);
  }

  async getCollectionsWithImage(): Promise<Collections[]> {
    const specificAddress = [
      '0xba9f7492055c25A302eae4d2375C6472D69b7A77',
      '0xd08efc644333d831caab0d19789e452265d8f4b5',
    ];

    const specific = await this.prismaService.collections.findMany({
      where: {
        address: {
          in: specificAddress,
        },
        imageUrl: {
          not: '',
        },
      },
    });

    const topCollections = await this.prismaService.collections.findMany({
      where: {
        imageUrl: {
          not: '',
        },
        address: {
          notIn: specific.map((c) => c.address),
        },
      },
      take: 10 - specific.length,
    });

    return [...specific, ...topCollections];
  }
}
