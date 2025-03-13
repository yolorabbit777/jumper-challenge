export interface Token {
  address: string;
  name: string;
  symbol: string;
  balance: string;
  decimals: number;
  network: string;
}

export interface Transaction {
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  value: string;
  from: string;
  to: string;
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
  Failed = 'Failed',
}
