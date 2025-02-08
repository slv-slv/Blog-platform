import { NextFunction, Request, Response } from 'express';
import { authService } from '../../instances/services.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { usersQueryRepo } from '../../instances/repositories.js';

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
