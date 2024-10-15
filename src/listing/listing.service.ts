import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Listing } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';

@Injectable()
export class ListingService {
  private readonly logger = new Logger(ListingService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async createListing(data: CreateListingDto) {
    const listing = await this.prismaService.listing.create({
      data: {
        ...data,
      },
    });
    this.logger.log(
      `Listing ${listing.tokenId} from ${listing.collectionAddress} created successfully`,
    );
  }

  async getTopLatestListing(): Promise<Listing[]> {
    return await this.prismaService.listing.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
  }
  async findListingByCollectionAndToken(
    collection: string,
    tokenId: number,
  ): Promise<Listing> {
    const listing = await this.prismaService.listing.findFirst({
      where: {
        collectionAddress: collection,
        tokenId: Number(tokenId),
      },
    });
    if (!listing) {
      throw new BadRequestException(
        `No listing found with token ${tokenId} at collection ${collection}`,
      );
    }
    return listing;
  }

  async removeListing(collectionAddress: string, tokenId: number) {
    const listing = await this.findListingByCollectionAndToken(
      collectionAddress,
      tokenId,
    );
    return await this.prismaService.listing.delete({
      where: {
        id: listing.id,
      },
    });
  }
}
