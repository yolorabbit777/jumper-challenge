import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import axios from 'axios';
import { formatUnits } from 'ethers';
import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { env } from '@/common/utils/envConfig';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { JWT_COOKIE_PREFIX, SUPPORTED_NETWORKS } from '@/constants';
import { NetworkConfig, Token, Transaction } from '@/types';

export const tokensRegistry = new OpenAPIRegistry();

tokensRegistry.registerPath({
  method: 'get',
  path: '/api/tokens',
  tags: ['Tokens'],
  request: {
    query: z.object({
      address: z.string(),
    }),
  },
  responses: createApiResponse(
    z.array(
      z.object({
        address: z.string(),
        name: z.string(),
        symbol: z.string(),
        balance: z.string(),
        decimals: z.number(),
        network: z.string(),
      })
    ),
    'Token list response'
  ),
});

const getAuthenticatedAddress = (
  cookies: { [key: string]: string },
  address: string
): string | null => {
  for (const [key, value] of Object.entries(cookies)) {
    if (key === `${JWT_COOKIE_PREFIX}${address.toLowerCase()}`) {
      try {
        const decoded = jwt.verify(value, env.JWT_SECRET) as { address: string };
        return decoded.address.toLowerCase();
      } catch (err) {
        continue;
      }
    }
  }
  return null;
};

const fetchTokenBalances = async (address: string, network: NetworkConfig): Promise<Token[]> => {
  try {
    const response = await axios.get(network.apiUrl, {
      params: {
        chainid: network.chainid,
        module: 'account',
        action: 'tokentx',
        address: address,
        sort: 'asc',
        apikey: network.apiKey,
      },
    });

    if (response.data.status !== '1') {
      if (response.data.message === 'No transactions found') {
        return [];
      }
      throw new Error(response.data.message || 'Failed to fetch token transactions');
    }

    const tokenBalances = new Map<
      string,
      {
        address: string;
        name: string;
        symbol: string;
        balance: bigint;
        decimals: number;
        network: string;
      }
    >();

    response.data.result.forEach((tx: Transaction) => {
      const tokenAddress = tx.contractAddress.toLowerCase();

      if (!tokenBalances.has(tokenAddress)) {
        tokenBalances.set(tokenAddress, {
          address: tokenAddress,
          name: tx.tokenName,
          symbol: tx.tokenSymbol,
          balance: 0n,
          decimals: parseInt(tx.tokenDecimal),
          network: network.name,
        });
      }

      const token = tokenBalances.get(tokenAddress)!;
      const amount = BigInt(tx.value);

      if (tx.to.toLowerCase() === address.toLowerCase()) {
        token.balance += amount;
      } else if (tx.from.toLowerCase() === address.toLowerCase()) {
        token.balance -= amount;
      }

      tokenBalances.set(tokenAddress, token);
    });

    const tokens: Token[] = Array.from(tokenBalances.values())
      .filter((token) => token.balance > 0n)
      .map((token) => ({
        address: token.address,
        name: token.name,
        symbol: token.symbol,
        balance: Number(formatUnits(token.balance, token.decimals)).toFixed(2),
        decimals: token.decimals,
        network: token.network,
      }));

    return tokens;
  } catch (error) {
    console.error(`Error fetching token balances from ${network.name}:`, error);
    return [];
  }
};

export const tokensRouter: Router = (() => {
  const router = express.Router();

  router.get('/', async (req: Request, res: Response) => {
    try {
      const requestedAddress = (req.query.address as string)?.toLowerCase();
      const authenticatedAddress = getAuthenticatedAddress(req.cookies, requestedAddress);

      if (!authenticatedAddress) {
        const serviceResponse = new ServiceResponse(
          ResponseStatus.Failed,
          'Not authenticated',
          null,
          StatusCodes.UNAUTHORIZED
        );
        return handleServiceResponse(serviceResponse, res);
      }

      // Check if requested address matches authenticated address
      if (!requestedAddress || requestedAddress !== authenticatedAddress) {
        const serviceResponse = new ServiceResponse(
          ResponseStatus.Success,
          'No tokens found for this address',
          [],
          StatusCodes.OK
        );
        return handleServiceResponse(serviceResponse, res);
      }

      // Fetch tokens from all supported networks in parallel
      const tokensPromises = SUPPORTED_NETWORKS.map((network) =>
        fetchTokenBalances(authenticatedAddress, network)
      );

      const allTokensArrays = await Promise.all(tokensPromises);
      const tokens = allTokensArrays.flat();

      const serviceResponse = new ServiceResponse(
        ResponseStatus.Success,
        'Tokens retrieved successfully',
        tokens,
        StatusCodes.OK
      );

      return handleServiceResponse(serviceResponse, res);
    } catch (err) {
      const serviceResponse = new ServiceResponse(
        ResponseStatus.Failed,
        err instanceof Error ? err.message : 'Failed to fetch tokens',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      return handleServiceResponse(serviceResponse, res);
    }
  });

  return router;
})();
