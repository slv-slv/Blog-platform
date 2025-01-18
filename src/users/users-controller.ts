import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { formatErrors } from '../helpers/format-errors.js';
import { usersService } from './users-service.js';
import { getPagingParams } from '../helpers/get-paging-params.js';
import { usersViewModelRepo } from './users-view-model-repo.js';

export const usersController = {
  getAllUsers: async (req: Request, res: Response) => {
    const searchLoginTerm = (req.query.searchLoginTerm as string) ?? null;
    const searchEmailTerm = (req.query.searchEmailTerm as string) ?? null;
    const paginationParams = getPagingParams(req);
    const users = await usersViewModelRepo.getAllUsers(searchLoginTerm, searchEmailTerm, paginationParams);
    res.status(200).json(users);
  },

  createUser: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errorsMessages: formatErrors(errors) });
      return;
    }

    const { login, password, email } = req.body;

    if (!usersService.isLoginUnique(login)) {
      res.status(400).json({ errorsMessages: [{ message: 'Login already exists', field: 'login' }] });
      return;
    }

    if (!usersService.isEmailUnique(email)) {
      res.status(400).json({ errorsMessages: [{ message: 'Email already exists', field: 'email' }] });
      return;
    }

    const newUser = await usersService.createUser(login, email, password);
    res.status(201).json(newUser);
  },

  deleteUser: async (req: Request, res: Response) => {
    const id = req.params.id;
    const isDeleted = await usersService.deleteUser(id);
    if (!isDeleted) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(204).end();
  },
};
