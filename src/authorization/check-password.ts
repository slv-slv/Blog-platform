import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { formatErrors } from '../validation/format-errors.js';
import { usersService } from '../services/users-service.js';

export const checkPassword = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errorsMessages: formatErrors(errors) });
    return;
  }

  const { loginOrEmail, password } = req.body;

  const isPasswordCorrect = await usersService.checkPassword(loginOrEmail, password);
  if (!isPasswordCorrect) {
    res.status(401).json({ error: 'Incorrect login/password' });
    return;
  }

  res.status(204).end();
};
