import { Controller, Get, Param } from '@nestjs/common';
import { OpenSeaService } from './openSea.service';

@Controller('opensea')
export class OpenSeaController {
  constructor(private readonly openSeaService: OpenSeaService) {}

  @Get('/account/:address/nfts')
  async getNFTsByAccount(@Param('address') address: string) {
    return await this.openSeaService.getNFTsByAccount(address);
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
}
