import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { AxiosWrapperService } from './axios-wrapper.service';
import { CollectionDto } from './dto/collection.dto';
import { NftData } from './dto/nft.data';

@Injectable()
export class OpenSeaService {
  constructor(
    private readonly axiosWrapperService: AxiosWrapperService,
    private readonly configService: ConfigService,
  ) {}
  baseUrl = 'https://testnets-api.opensea.io/api/v2';
  chainName = 'sepolia';
  openSeaKey = this.configService.get<string>('OPENSEA_KEY');

  private createGetRequestConfig(url: string): AxiosRequestConfig {
    const timeout = this.configService.get<number>('OPENSEA_TIMEOUT') || 5000;

    return {
      method: 'GET',
      url,
      headers: {
        Accept: 'application/json',
        'x-api-key': this.openSeaKey,
      },
      timeout,
    };
  }

  async getNFTsByAccount(address: string): Promise<NftData> {
    const options = this.createGetRequestConfig(
      `${this.baseUrl}/chain/${this.chainName}/account/${address}/nfts?limit=200`,
    );
    const data = this.axiosWrapperService.request(options);
    return data;
  }

  async filterUniqueCollections(address: string): Promise<CollectionDto[]> {
    const response = await this.getNFTsByAccount(address);
    const nfts = response.nfts;

    if (!Array.isArray(nfts)) {
      throw new BadRequestException(
        'Expected an array of NFTs but received something else',
      );
    }

    const uniqueCollectionsMap = new Map<string, string>();
    nfts.forEach((nft: any) => {
      if (!uniqueCollectionsMap.has(nft.collection)) {
        uniqueCollectionsMap.set(nft.collection, nft.contract);
      }
    });

    return Array.from(uniqueCollectionsMap.entries()).map(
      ([collection, contract]) => ({ collection, contract }),
    );
  }

  async getCollectionByName(name: string): Promise<any> {
    const options = this.createGetRequestConfig(
      `${this.baseUrl}/collections/${name}`,
    );
    return this.axiosWrapperService.request(options);
  }

  // https://testnets-api.opensea.io/api/v2/collection/{collection_slug}/nfts
  async getNFTsByCollectionName(name: string): Promise<any> {
    const options = this.createGetRequestConfig(
      `${this.baseUrl}/collection/${name}/nfts`,
    );
    return this.axiosWrapperService.request(options);
  }

  // https://testnets-api.opensea.io/api/v2/chain/{chain}/contract/{address}/nfts
  async getNFTsByContractAddress(address: string): Promise<any> {
    const options = this.createGetRequestConfig(
      `${this.baseUrl}/chain/${this.chainName}/contract/${address}/nfts`,
    );
    return this.axiosWrapperService.request(options);
  }
}
