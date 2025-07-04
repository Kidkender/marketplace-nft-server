import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ActivityAction, Listing } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { ActivityService } from 'src/activity/activity.service';

@Injectable()
export class ListingService {
  private readonly logger = new Logger(ListingService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly activityService: ActivityService,
  ) {}

  async isListingAvailable(
    collectionAddress: string,
    tokenId: number,
  ): Promise<boolean> {
    return !!(await this.getActiveListing(collectionAddress, tokenId));
  }

  private async getActiveListing(collectionAddress: string, tokenId: number) {
    return this.prismaService.listing.findFirst({
      where: {
        collectionAddress,
        tokenId,
        status: 'ACTIVE',
      },
    });
  }

  async createListing(data: CreateListingDto) {
    const { collectionAddress, tokenId, wallet, price } = data;

    const existListing = await this.prismaService.listing.findFirst({
      where: { collectionAddress, tokenId },
    });

    if (existListing) {
      if (existListing.status === 'ACTIVE') return;
      if (existListing.status === 'CANCELED') {
        await this.prismaService.listing.update({
          where: { id: existListing.id },
          data: {
            status: 'ACTIVE',
            price,
          },
        });
        return;
      }
    }

    const listing = await this.prismaService.listing.create({
      data: { ...data, status: 'ACTIVE' },
    });

    await this.activityService.createActivity({
      action: ActivityAction.SELL,
      description: `User ${wallet} listed NFT with price ${price}`,
      price,
      userAddress: wallet,
    });

    this.logger.log(`Created listing for ${tokenId} at ${collectionAddress}`);
    return listing;
  }

  async getTopLatestListing(): Promise<Listing[]> {
    return this.prismaService.listing.findMany({
      where: {
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'desc' },
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
        status: 'ACTIVE',
      },
    });

    if (!listing) {
      return;
    }

    return listing;
  }

  async removeListing(collectionAddress: string, tokenId: number) {
    const listing = await this.findListingByCollectionAndToken(
      collectionAddress,
      tokenId,
    );

    if (listing.status !== 'ACTIVE') {
      return;
    }

    const updated = await this.prismaService.listing.update({
      where: { id: listing.id },
      data: { status: 'CANCELED' },
    });

    await this.activityService.createActivity({
      action: ActivityAction.CANCEL_LISTING,
      description: `User ${listing.wallet} canceled NFT listing`,
      price: listing.price,
      userAddress: listing.wallet,
    });

    this.logger.log(
      `Canceled listing ${listing.tokenId} at ${collectionAddress}`,
    );
    return updated;
  }

  async buyNft(wallet: string, collectionAddress: string, tokenId: number) {
    const listing = await this.findListingByCollectionAndToken(
      collectionAddress,
      tokenId,
    );

    if (listing.status !== 'ACTIVE') {
      throw new BadRequestException(
        `Listing is already ${listing.status.toLowerCase()}`,
      );
    }

    const updated = await this.prismaService.listing.update({
      where: { id: listing.id },
      data: {
        status: 'SOLD',
        wallet,
      },
    });

    await this.activityService.createActivity({
      action: ActivityAction.BUY,
      description: `User ${wallet} bought NFT`,
      price: listing.price,
      userAddress: wallet,
    });

    this.logger.log(
      `User ${wallet} bought NFT ${tokenId} from ${collectionAddress}`,
    );
    return updated;
  }
}
