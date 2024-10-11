import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import * as https from 'https';

@Injectable()
export class AxiosWrapperService {
  constructor() {
    axiosRetry(axios, {
      retries: 3,
      retryCondition(error) {
        return error.response?.status === 429 || !error.response;
      },
    });
  }

  private httpsAgent = new https.Agent({
    keepAlive: true,
    maxSockets: 50,
    timeout: 60000,
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
          details: error.response?.data || {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
