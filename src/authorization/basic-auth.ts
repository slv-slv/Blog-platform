import { credentials } from './credentials.js';
import { NextFunction, Request, Response } from 'express';

export const checkBasicAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let isAuth = false;

  if (authHeader) {
    const [authMethod, credsBase64] = authHeader.split(' ');
    isAuth = authMethod === 'Basic' && credentials.map((user) => user.base64).includes(credsBase64);
  }

  if (!authHeader || !isAuth) {
    res.status(401).json({ error: 'unsuccessful authorization' });
    return;
  }
  next();
};
