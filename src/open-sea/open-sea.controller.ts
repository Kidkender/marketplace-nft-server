import { Controller, Get, Param } from '@nestjs/common';
import { OpenSeaService } from './openSea.service';

@Controller('opensea')
export class OpenSeaController {
  constructor(private readonly openSeaService: OpenSeaService) {}

  @Get('/account/:address/nfts')
  async getNFTsByAccount(@Param('address') address: string) {
    return await this.openSeaService.getNFTsByAccount(address);
  }
}
