import { Body, Controller, Get, Post } from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';

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
}
