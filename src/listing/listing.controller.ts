import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { ListingService } from './listing.service';

@Controller('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post()
  async createListing(@Body() req: CreateListingDto) {
    return this.listingService.createListing(req);
  }

  @Get('latest')
  async getLatestListing() {
    return this.listingService.getTopLatestListing();
  }

  @Delete(':collectionAddress/:tokenId')
  async deleteListing(
    @Param('collectionAddress') collectionAddress: string,
    @Param('tokenId') tokenId: number,
  ) {
    return this.listingService.removeListing(collectionAddress, tokenId);
  }
}
