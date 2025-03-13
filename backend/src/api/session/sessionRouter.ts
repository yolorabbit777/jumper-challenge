import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { env } from '@/common/utils/envConfig';
import { JWT_COOKIE_PREFIX } from '@/constants';

export const sessionRegistry = new OpenAPIRegistry();

export const sessionRouter: Router = (() => {
  const router = express.Router();

  sessionRegistry.registerPath({
    method: 'post',
    path: '/api/session/verify',
    tags: ['Session'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              address: z.string(),
            }),
          },
        },
      },
    },
    responses: createApiResponse(
      z.object({
        isValid: z.boolean(),
        address: z.string().optional(),
      }),
      'Session verification response'
    ),
  });

  router.post('/verify', (req: Request, res: Response) => {
    try {
      const { address } = req.body;
      const cookies = req.cookies;
      let currentAddress: string | undefined;
      let isValid = false;

      // Check all cookies for a valid JWT token
      for (const [key, value] of Object.entries(cookies)) {
        if (key === `${JWT_COOKIE_PREFIX}${address.toLowerCase()}`) {
          try {
            const decoded = jwt.verify(value, env.JWT_SECRET) as { address: string };
            // Verify that the decoded address matches the provided address
            if (decoded.address.toLowerCase() === address.toLowerCase()) {
              currentAddress = decoded.address.toLowerCase();
              isValid = true;
              break;
            }
          } catch (err) {
            // Invalid or expired token, continue checking other cookies
            continue;
          }
        }
      }

      const serviceResponse = new ServiceResponse(
        ResponseStatus.Success,
        isValid ? 'Valid session' : 'No valid session found',
        { isValid, address: currentAddress },
        StatusCodes.OK
      );

      return handleServiceResponse(serviceResponse, res);
    } catch (err) {
      const serviceResponse = new ServiceResponse(
        ResponseStatus.Failed,
        'Failed to verify session',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      return handleServiceResponse(serviceResponse, res);
    }
  });

  return router;
})(); 