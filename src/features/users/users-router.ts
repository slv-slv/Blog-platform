import { Router } from 'express';
import { usersController } from './users-controller.js';
import { authController } from '../../auth/auth-controller.js';
import { pagingValidators } from '../../common/validation/paging-params-validation.js';
import { userValidators } from './users-validation.js';

export const usersRouter = Router();

usersRouter.get(
  '/',
  authController.basicAuth,
  pagingValidators.usersSortBy,
  pagingValidators.sortDirection,
  pagingValidators.pageNumber,
  pagingValidators.pageSize,
  userValidators.searchLoginTerm,
  userValidators.searchEmailTerm,
  usersController.getAllUsers,
);

usersRouter.post(
  '/',
  authController.basicAuth,
  userValidators.login,
  userValidators.newPassword,
  userValidators.email,
  usersController.createUser,
);

usersRouter.delete('/:id', authController.basicAuth, usersController.deleteUser);
