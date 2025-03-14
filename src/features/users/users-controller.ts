import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../common/types/http-status-codes.js';
import { inject, injectable } from 'inversify';
import { UsersQueryRepo } from './users-query-repo.js';
import { UsersService } from './users-service.js';
import { httpCodeByResult, RESULT_STATUS } from '../../common/types/result-status-codes.js';

@injectable()
export class UsersController {
  constructor(
    @inject(UsersQueryRepo) private usersQueryRepo: UsersQueryRepo,
    @inject(UsersService) private usersService: UsersService,
  ) {}

  async getAllUsers(req: Request, res: Response) {
    const searchLoginTerm = (req.query.searchLoginTerm as string) ?? null;
    const searchEmailTerm = (req.query.searchEmailTerm as string) ?? null;
    const pagingParams = res.locals.pagingParams;

    const users = await this.usersQueryRepo.getAllUsers(searchLoginTerm, searchEmailTerm, pagingParams);
    res.status(HTTP_STATUS.OK_200).json(users);
  }

  async createUser(req: Request, res: Response) {
    const { login, password, email } = req.body;

    const result = await this.usersService.createUser(login, email, password);

    if (result.status !== RESULT_STATUS.CREATED) {
      res.status(httpCodeByResult(result.status)).json(result.extensions);
    }

    res.status(HTTP_STATUS.CREATED_201).json(result.data);
  }

  async deleteUser(req: Request, res: Response) {
    const id = req.params.id;
    const result = await this.usersService.deleteUser(id);

    if (result.status !== RESULT_STATUS.NO_CONTENT) {
      res.status(httpCodeByResult(result.status)).json(result.extensions);
    }

    res.status(HTTP_STATUS.NO_CONTENT_204).end();
  }
}
