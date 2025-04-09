import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
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
}
