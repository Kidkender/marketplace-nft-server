import { Module } from '@nestjs/common';
import { CollectionsModule } from 'src/collections/collections.module';
import { AxiosWrapperService } from '../open-sea/axios-wrapper.service';
import { OpenSeaService } from '../open-sea/openSea.service';
import { OpenSeaController } from './open-sea.controller';
import { ListingModule } from 'src/listing/listing.module';

@Module({
  imports: [CollectionsModule, ListingModule],
  controllers: [OpenSeaController],
  providers: [OpenSeaService, AxiosWrapperService],
})
export class OpenSeaModule {}
