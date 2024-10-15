import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OpenSeaService } from './openSea.service';
import { GetNftsDto } from './dto/get-nfts.dto';

@Controller('opensea')
export class OpenSeaController {
  constructor(private readonly openSeaService: OpenSeaService) {}

  @Post('/account/nfts')
  async getNFTsByAccount(@Body() request: GetNftsDto) {
    return await this.openSeaService.getNFTsByAccount(request);
  }

  @Get('/collection/:collection')
  async getCollectionByName(@Param('collection') collection: string) {
    return await this.openSeaService.getCollectionByName(collection);
  }

  @Get('/collection/:collection/nfts')
  async getNftsByCollection(@Param('collection') collection: string) {
    return await this.openSeaService.getNFTsByCollectionName(collection);
  }

  @Get('/collection/:address/address')
  async getCollectionByAddress(@Param('address') address: string) {
    return await this.openSeaService.getNFTsByContractAddress(address);
  }

  @Get('collection/:address/owner')
  async getCollectionsByOwner(@Param('address') address: string) {
    return await this.openSeaService.filterUniqueCollections(address);
  }

  @Get('nft/:address/:tokenId')
  async getNFT(
    @Param('address') address: string,
    @Param('tokenId') tokenId: number,
  ): Promise<any> {
    return this.openSeaService.getNFT(address, tokenId);
  }

  @Get('collections/fetch')
  async fetchAndCreateCollection() {
    return this.openSeaService.fetchAndCreateCollections();
  }
}
