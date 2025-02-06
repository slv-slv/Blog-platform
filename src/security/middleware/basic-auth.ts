import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { SETTINGS } from '../../settings.js';

export const basicAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Authorization header missing' });
    return;
  }

  const [authMethod, credsBase64] = authHeader.split(' ');
  const credentials = SETTINGS.CREDENTIALS;

  if (authMethod !== 'Basic' || !credsBase64) {
    res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Invalid authorization method' });
    return;
  }

  if (!credentials.map((user) => user.base64).includes(credsBase64)) {
    res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Incorrect credentials' });
    return;
  }

  next();
};
