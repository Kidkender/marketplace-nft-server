import { Body, Controller, Post } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CollectionsService } from './collections.service';

@Controller('collections')
export class CollectionsController {
  constructor(private collectionService: CollectionsService) {}
  @Post()
  async createNewCollection(@Body() data: CreateCollectionDto) {
    return await this.collectionService.createCollection(data);
  }
}
