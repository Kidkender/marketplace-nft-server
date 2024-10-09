import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { AxiosWrapperService } from './axios-wrapper.service';
import { ConfigService } from '@nestjs/config';

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
    return {
      method: 'GET',
      url,
      headers: {
        Accept: 'application/json',
        'x-api-key': this.openSeaKey,
      },
      timeout: 5000,
    };
  }

  //   url: 'https://testnets-api.opensea.io/api/v2/chain/sepolia/account/address/nfts',

  async getNFTsByAccount(address: string): Promise<any> {
    const options = this.createGetRequestConfig(
      `${this.baseUrl}/chain/${this.chainName}/account/${address}/nfts`,
    );
    return this.axiosWrapperService.request(options);
  }
}
