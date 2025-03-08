import { NextFunction, Request, Response } from 'express';
import { container } from '../../ioc/container.js';
import { AuthService } from '../auth/auth-service.js';

const authService = container.get(AuthService);

export const getUserId = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.locals.userId = null;
    return next();
  }

  const [authMethod, token] = authHeader.split(' ');

  if (authMethod !== 'Bearer' || !token) {
    res.locals.userId = null;
    return next();
  }

  const payload = authService.verifyJwt(token);
  if (!payload) {
    res.locals.userId = null;
    return next();
  }

  const { userId } = payload;
  res.locals.userId = userId;

  return next();
};
