import { NetworkConfig } from '@/types';
import { env } from '@/common/utils/envConfig';

export const SUPPORTED_NETWORKS: NetworkConfig[] = [
  {
    name: 'ethereum',
    apiUrl: 'https://api.etherscan.io/api',
    apiKey: env.ETHERSCAN_API_KEY,
    chainid: 1,
  },
  {
    name: 'polygon',
    apiUrl: 'https://api.polygonscan.com/api',
    apiKey: env.POLYGONSCAN_API_KEY,
    chainid: 137
  },
  {
    name: 'bsc',
    apiUrl: 'https://api.bscscan.com/api',
    apiKey: env.BSCSCAN_API_KEY,
    chainid: 56
  }
];

export const JWT_COOKIE_PREFIX = 'jwtToken_'; 