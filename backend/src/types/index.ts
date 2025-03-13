import { z } from 'zod';

export interface Token {
  address: string;
  name: string;
  symbol: string;
  balance: string;
  decimals: number;
  network: string;
}

export interface NetworkConfig {
  name: string;
  apiUrl: string;
  apiKey: string;
  chainid: number;
}

// Response types
export interface ServiceResponse<T> {
  status: ResponseStatus;
  message: string;
  responseObject: T | null;
  statusCode: number;
}

export enum ResponseStatus {
  Success = 'Success',
  Failed = 'Failed'
} 