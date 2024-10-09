import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import * as https from 'https';

@Injectable()
export class AxiosWrapperService {
  private httpsAgent = new https.Agent({
    keepAlive: true,
    maxSockets: 50,
  });

  async request(options: AxiosRequestConfig): Promise<any> {
    try {
      const response = await axios.request({
        ...options,
        httpsAgent: this.httpsAgent,
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message || 'Failed to make request',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
