import { Module } from '@nestjs/common';
import { OpenSeaService } from '../open-sea/openSea.service';
import { AxiosWrapperService } from '../open-sea/axios-wrapper.service';
import { OpenSeaController } from './open-sea.controller';

@Module({
  imports: [],
  controllers: [OpenSeaController],
  providers: [OpenSeaService, AxiosWrapperService],
})
export class OpenSeaModule {}
