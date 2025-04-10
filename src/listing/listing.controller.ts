import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { ListingService } from './listing.service';
import { HttpStatusCode } from 'axios';

@Controller('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post()
  @HttpCode(HttpStatusCode.Ok)
  async createListing(@Body() req: CreateListingDto) {
    return this.listingService.createListing(req);
  }

  @Get('latest')
  async getLatestListing() {
    return this.listingService.getTopLatestListing();
  }

  @Delete(':collectionAddress/:tokenId')
  @HttpCode(HttpStatusCode.Ok)
  async deleteListing(
    @Param('collectionAddress') collectionAddress: string,
    @Param('tokenId') tokenId: number,
  ) {
    return this.listingService.removeListing(collectionAddress, tokenId);
  }

  @Get(':collectionAddress/:tokenId')
  async findOne(
    @Param('collectionAddress') collectionAddress: string,
    @Param('tokenId', ParseIntPipe) tokenId: number,
  ) {
    return this.listingService.findListingByCollectionAndToken(
      collectionAddress,
      tokenId,
    );
  }

  @Post('buy')
  @HttpCode(HttpStatusCode.Ok)
  async buyNft(
    @Body()
    body: {
      wallet: string;
      collectionAddress: string;
      tokenId: number;
    },
  ) {
    const { wallet, collectionAddress, tokenId } = body;
    return this.listingService.buyNft(wallet, collectionAddress, tokenId);
  }
}
