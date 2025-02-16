import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { container } from '../../ioc/container.js';
import { AuthService } from '../auth/auth-service.js';
import { UsersQueryRepo } from '../../features/users/users-query-repo.js';

const authService = container.get(AuthService);
const usersQueryRepo = container.get(UsersQueryRepo);

export const checkCredentials = async (req: Request, res: Response, next: NextFunction) => {
  const { loginOrEmail, password } = req.body;

  const isCorrect = await authService.checkCredentials(loginOrEmail, password);
  if (!isCorrect) {
    res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Incorrect login/password' });
    return;
  }

  const user = await usersQueryRepo.findUser(req.body.loginOrEmail);
  res.locals.userId = user!.id; // для выпуска пары токенов дальше по цепочке middleware

  next();
};
