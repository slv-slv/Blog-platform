import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { container } from '../../ioc/container.js';
import { UsersService } from '../../features/users/users-service.js';

const usersService = container.get(UsersService);

export const checkConfirmation = async (req: Request, res: Response, next: NextFunction) => {
  const { loginOrEmail } = req.body;
  if (!(await usersService.isConfirmed(loginOrEmail))) {
    res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Email has not been confirmed' });
    return;
  }

  next();
};
