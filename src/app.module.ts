import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CollectionsModule } from './collections/collections.module';
import HttpConfigService from './config/httpConfig.service';
import { NftModule } from './nft/nft.module';
import { OpenSeaModule } from './open-sea/openSea.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    PrismaModule,
    CollectionsModule,
    NftModule,
    OpenSeaModule,
    HttpModule.registerAsync({ useClass: HttpConfigService }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
