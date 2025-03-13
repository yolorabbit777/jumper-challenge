import request from 'supertest';
import express, { Express } from 'express';
import { sessionRouter } from '@/api/session/sessionRouter';
import { StatusCodes } from 'http-status-codes';
import { vi } from 'vitest';
import cookieParser from 'cookie-parser';

// mock environment variables for testing
process.env.JWT_SECRET = 'JWT SECRET';

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

describe('Session Router', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api/session', sessionRouter);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should verify valid session', async () => {
    const res = await request(app)
      .post('/api/session/verify')
      .set('Cookie', ['jwtToken_0x00=valid_token'])
      .send({ address: '0x00' });

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.responseObject).toEqual({     
        isValid: true,
        address: '0x00'
    });
  });

  it('should return invalid for missing cookie', async () => {
    const res = await request(app)
      .post('/api/session/verify')
      .send({ address: '0x00' });

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.responseObject).toEqual({
        isValid: false
    });
  });

  it('should return invalid for wrong address', async () => {
    const res = await request(app)
      .post('/api/session/verify')
      .set('Cookie', ['jwtToken_0x01=valid_token'])
      .send({ address: '0x00' });

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.responseObject).toEqual({
        isValid: false
    });
  });

  it('should return invalid for invalid token', async () => {
    const res = await request(app)
      .post('/api/session/verify')
      .set('Cookie', ['jwtToken_0x00=invalid_token'])
      .send({ address: '0x00' });

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.responseObject).toEqual({
        isValid: false
    });
  });
}); 