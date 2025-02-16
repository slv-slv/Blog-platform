import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { container } from '../../ioc/container.js';
import { UsersQueryRepo } from '../../features/users/users-query-repo.js';

const usersQueryRepo = container.get(UsersQueryRepo);

export const checkConfirmation = async (req: Request, res: Response, next: NextFunction) => {
  const { loginOrEmail } = req.body;
  if (!(await usersQueryRepo.isConfirmed(loginOrEmail))) {
    res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Email not confirmed' });
    return;
  }

  next();
};
