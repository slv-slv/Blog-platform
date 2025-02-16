import { Request, Response } from 'express';
import { getPagingParams } from '../../common/utils/get-paging-params.js';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { inject, injectable } from 'inversify';
import { UsersQueryRepo } from './users-query-repo.js';
import { UsersService } from './users-service.js';

@injectable()
export class UsersController {
  constructor(
    @inject(UsersQueryRepo) private usersQueryRepo: UsersQueryRepo,
    @inject(UsersService) private usersService: UsersService,
  ) {}

  async getAllUsers(req: Request, res: Response) {
    const searchLoginTerm = (req.query.searchLoginTerm as string) ?? null;
    const searchEmailTerm = (req.query.searchEmailTerm as string) ?? null;
    const pagingParams = getPagingParams(req);
    const users = await this.usersQueryRepo.getAllUsers(searchLoginTerm, searchEmailTerm, pagingParams);
    res.status(HTTP_STATUS.OK_200).json(users);
  }

  async createUser(req: Request, res: Response) {
    const { login, password, email } = req.body;

    if (!(await this.usersService.isLoginUnique(login))) {
      res
        .status(HTTP_STATUS.BAD_REQUEST_400)
        .json({ errorsMessages: [{ message: 'Login already exists', field: 'login' }] });
      return;
    }

    if (!(await this.usersService.isEmailUnique(email))) {
      res
        .status(HTTP_STATUS.BAD_REQUEST_400)
        .json({ errorsMessages: [{ message: 'Email already exists', field: 'email' }] });
      return;
    }

    const newUser = await this.usersService.createUser(login, email, password);
    res.status(HTTP_STATUS.CREATED_201).json(newUser);
  }

  async deleteUser(req: Request, res: Response) {
    const id = req.params.id;
    const isDeleted = await this.usersService.deleteUser(id);
    if (!isDeleted) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json({ error: 'User not found' });
      return;
    }
    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }
}
