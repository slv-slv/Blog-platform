import { credentials } from './credentials.js';
import { NextFunction, Request, Response } from 'express';

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let isAuth = false;

  if (authHeader) {
    const [, authReqBase64] = authHeader.split(' ');
    isAuth = credentials.map((user) => user.base64).includes(authReqBase64);
  }

  if (!authHeader || !isAuth) {
    res.status(401).json({ error: 'unsuccessful authorization' });
  }
  next();
};