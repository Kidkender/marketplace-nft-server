import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { Listing } from '@prisma/client';

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
}
