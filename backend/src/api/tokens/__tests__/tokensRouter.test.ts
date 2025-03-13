import request from 'supertest';
import express, { Express } from 'express';
import { tokensRouter } from '@/api/tokens/tokensRouter';
import { StatusCodes } from 'http-status-codes';
import { vi } from 'vitest';
import cookieParser from 'cookie-parser';
import axios from 'axios';

// mock environment variables for testing
process.env.JWT_SECRET = 'JWT SECRET';

vi.mock('axios');
const mockedAxios = axios as any;

vi.mock('jsonwebtoken', async () => {
  const actualModule = await vi.importActual('jsonwebtoken');
  return {
    default: {
      ...actualModule,
      verify: vi.fn((token) => {
        if (token === 'valid_token') return { address: '0x00' };
        throw new Error('Invalid token');
      }),
    },
  };
});

describe('Tokens Router', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api/tokens', tokensRouter);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return tokens for authenticated user', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        status: '1',
        result: [{
          contractAddress: '0xtoken1',
          tokenName: 'Token1',
          tokenSymbol: 'TK1',
          tokenDecimal: '18',
          value: '1000000000000000000',
          from: '0x01',
          to: '0x00'
        }]
      }
    });

    const res = await request(app)
      .get('/api/tokens')
      .query({ address: '0x00' })
      .set('Cookie', ['jwtToken_0x00=valid_token']);

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.responseObject).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          address: '0xtoken1',
          name: 'Token1',
          symbol: 'TK1',
          balance: expect.any(String)
        })
      ])
    );
  });

  it('should return 401 for unauthenticated request', async () => {
    const res = await request(app)
      .get('/api/tokens')
      .query({ address: '0x00' });

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.success).toBe(false);
  });

  it('should return empty array for non-matching address', async () => {
    const res = await request(app)
      .get('/api/tokens')
      .query({ address: '0x01' })
      .set('Cookie', ['jwtToken_0x00=valid_token']);

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.success).toBe(false);
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    const res = await request(app)
      .get('/api/tokens')
      .query({ address: '0x00' })
      .set('Cookie', ['jwtToken_0x00=valid_token']);

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.responseObject).toEqual([]);
  });

  it('should handle empty token list', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        status: '1',
        result: []
      }
    });

    const res = await request(app)
      .get('/api/tokens')
      .query({ address: '0x00' })
      .set('Cookie', ['jwtToken_0x00=valid_token']);

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.responseObject).toEqual([]);
  });
}); 