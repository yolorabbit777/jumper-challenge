import { verifyMessage } from 'ethers';
import express, { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { vi } from 'vitest';

import { authRouter } from '@/api/auth/authRouter';

// mock environment variables for testing
process.env.SIGN_MESSAGE = 'SIGN MESSAGE';
process.env.JWT_SECRET = 'JWT SECRET';

vi.mock('ethers', () => ({
  verifyMessage: vi.fn(),
}));

vi.mock('jsonwebtoken', async () => {
  const actualModule = await vi.importActual('jsonwebtoken');
  return {
    default: { ...actualModule, verify: vi.fn(), sign: vi.fn(() => 'jsonwebtoken') },
  };
});

describe('Auth Router', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRouter);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should address or signature missing', async () => {
    const res = await request(app).post('/api/auth/create').send({ address: '0x00' });
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('message', 'Address or Signature is missing');
  });

  it('should return error for invalid signature', async () => {
    (verifyMessage as any).mockReturnValue('0x01');
    const res = await request(app).post('/api/auth/create').send({
      address: '0x00',
      signature: '0x01 signature',
    });
    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toHaveProperty('message', 'Address and Signature does not match.');
  });

  it('should return success for valid signature and set http-only cookie', async () => {
    (verifyMessage as any).mockReturnValue('0x00');
    const res = await request(app).post('/api/auth/create').send({
      address: '0x00',
      signature: '0x00 signature',
    });

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('message', 'Account verified successfully');
    expect(res.header['set-cookie'][0]).toContain('jwtToken_0x00=');
  });
});
