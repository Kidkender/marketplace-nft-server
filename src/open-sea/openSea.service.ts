import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { AxiosRequestConfig } from 'axios';
import { CollectionsService } from 'src/collections/collections.service';
import { ListingService } from 'src/listing/listing.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { URLSearchParams } from 'url';
import { AxiosWrapperService } from './axios-wrapper.service';
import { CollectionDto } from './dto/collection.dto';
import { GetNftsDto } from './dto/get-nfts.dto';
import { CollectionsResponse } from './dto/opensea.interface';

@Injectable()
export class OpenSeaService {
  constructor(
    private readonly axiosWrapperService: AxiosWrapperService,
    private readonly configService: ConfigService,
    private readonly collectionService: CollectionsService,
    private readonly listingService: ListingService,
    private readonly prismaService: PrismaService,
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

  async getNFTsByAccount(request: GetNftsDto): Promise<any> {
    const { address, collection } = request;
    const params = new URLSearchParams();
    let url = `${this.baseUrl}/chain/${this.chainName}/account/${address}/nfts`;

    if (collection) {
      params.append('collection', collection);
    }
    params.append('limit', '200');

    url += `?${params.toString()}`;
    const options = this.createGetRequestConfig(url);
    const result = await this.axiosWrapperService.request(options);

    if (!result?.nfts?.length) return result;

    const nftIdentifiers = result.nfts.map((nft) => ({
      collectionAddress: nft.contract,
      tokenId: Number(nft.identifier),
    }));

    const listings = await this.prismaService.listing.findMany({
      where: {
        OR: nftIdentifiers.map(({ collectionAddress, tokenId }) => ({
          collectionAddress,
          tokenId,
          status: 'ACTIVE',
        })),
      },
    });

    const listingMap = new Map();

    listings.forEach((listing) => {
      const key = `${listing.collectionAddress}-${listing.tokenId}`;
      listingMap.set(key, listing);
    });

    result.nfts = result.nfts.map((nft) => {
      const key = `${nft.contract}-${Number(nft.identifier)}`;
      const listing = listingMap.get(key);
      return listing ? { ...nft, price: listing.price } : nft;
    });

    return result;
  }

  async filterUniqueCollections(
    address: string,
    collection?: string,
  ): Promise<CollectionDto[]> {
    const request: GetNftsDto = {
      address,
      collection,
    };
    const response = await this.getNFTsByAccount(request);
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
      `${this.baseUrl}/collection/${name}/nfts?limit=10`,
    );
    return this.axiosWrapperService.request(options);
  }

  // https://testnets-api.opensea.io/api/v2/chain/{chain}/contract/{address}/nfts
  async getNFTsByContractAddress(address: string): Promise<any> {
    const options = this.createGetRequestConfig(
      `${this.baseUrl}/chain/${this.chainName}/contract/${address}/nfts?limit=20`,
    );

    const result = await this.axiosWrapperService.request(options);

    if (!result?.nfts?.length) return result;

    const tokenIds = result.nfts.map((nft) => Number(nft.identifier));

    const listings = await this.prismaService.listing.findMany({
      where: {
        collectionAddress: address,
        tokenId: { in: tokenIds },
        status: 'ACTIVE',
      },
    });

    const listingMap = new Map<number, any>();
    listings.forEach((l) => listingMap.set(l.tokenId, l));

    result.nfts = result.nfts.map((nft) => {
      const listing = listingMap.get(Number(nft.identifier));
      return listing ? { ...nft, price: listing.price } : nft;
    });

    return result;
  }

  //  https://testnets-api.opensea.io/api/v2/chain/sepolia/contract/{address}/nfts/{tokenId} \
  async getNFT(address: string, tokenId: number): Promise<any> {
    const options = this.createGetRequestConfig(
      `${this.baseUrl}/chain/${this.chainName}/contract/${address}/nfts/${tokenId}`,
    );
    const [result, listing] = await Promise.all([
      this.axiosWrapperService.request(options),
      this.listingService.findListingByCollectionAndToken(address, tokenId),
    ]);

    if (listing?.price) {
      result.price = listing.price;
    }

    return result;
  }

  // 'https://testnets-api.opensea.io/api/v2/collections?chain=sepolia&limit=10' \

  async fetchAndCreateCollections() {
    const options = this.createGetRequestConfig(
      `${this.baseUrl}/collections?chain=${this.chainName}&limit=20`,
    );
    const response: CollectionsResponse =
      await this.axiosWrapperService.request(options);
    const collections = response.collections;

    const createDtos: Prisma.CollectionsCreateManyInput[] = collections.map(
      (collection) => ({
        name: collection.name,
        symbol: collection.collection,
        uri: collection.opensea_url || collection.project_url || '',
        description: collection.description || null,
        totalSupply: 1000,
        address: collection.contracts[0]?.address || '',
        userId: 7,
        imageUrl: collection.image_url,
        createdAt: new Date(),
      }),
    );

    await this.collectionService.createMultiCollection(createDtos);
  }
}
