import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { env } from '@/common/utils/envConfig';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { verifyMessage } from 'ethers'
import jwt from 'jsonwebtoken'

export const authRegistry = new OpenAPIRegistry();

export const authRouter: Router = (() => {
  const router = express.Router();

  authRegistry.registerPath({
    method: 'post',
    path: '/api/auth/create',
    tags: ['Account Creation'],
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        address: { type: 'string' },
                        signature: { type: 'string' }
                    },
                    required: ['address', 'signature']
                }
            }
        }
    },
    responses: createApiResponse(
        z.object({
            success: z.boolean(),
            message: z.string().optional(),
        }),
        'Account creation successful.'
    )
  });

  router.post('/create', (req: Request, res: Response) => {
    try {
        const { address, signature } = req.body;
        if (!address || !signature) {
            const serviceResponse = new ServiceResponse(
                ResponseStatus.Failed,
                'Address or Signature is missing',
                null,
                StatusCodes.BAD_REQUEST
            );

            return handleServiceResponse(serviceResponse, res);
        }

        const SIGN_MESSAGE = env.SIGN_MESSAGE;
        const verifiedAddress = verifyMessage(SIGN_MESSAGE, signature);

        if (verifiedAddress.toLowerCase() !== address.toLowerCase()) {
            const serviceResponse = new ServiceResponse(
                ResponseStatus.Failed,
                'Address and Signature does not match.',
                null,
                StatusCodes.UNAUTHORIZED
            );

            return handleServiceResponse(serviceResponse, res);
        }

        const jwtToken = jwt.sign({ address }, env.JWT_SECRET, {
            expiresIn: '1h'
        })

        res.cookie(`jwtToken_${address.toLowerCase()}`, jwtToken, {
            sameSite: 'strict',
            maxAge: 3600000
        })

        const serviceResponse = new ServiceResponse(
            ResponseStatus.Success,
            'Account verified successfully',
            { address },
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }
    catch (err) {
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Failed,
            'Internal Server Error',
            null,
            StatusCodes.INTERNAL_SERVER_ERROR
        )
        return handleServiceResponse(serviceResponse, res);
    }
  });

  return router;
})();
