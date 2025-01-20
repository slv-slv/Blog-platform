import { Router } from 'express';
import { usersController } from './users-controller.js';
import { authController } from '../../auth/auth-controller.js';
import {
  pageNumberValidation,
  pageSizeValidation,
  sortDirectionValidation,
  usersSortByValidation,
} from '../../common/validation/paging-params-validation.js';
import {
  emailValidation,
  loginValidation,
  newPasswordValidation,
  searchEmailTermValidation,
  searchLoginTermValidation,
} from './users-validation.js';

export const usersRouter = Router();

usersRouter.get(
  '/',
  authController.basicAuth,
  usersSortByValidation,
  sortDirectionValidation,
  pageNumberValidation,
  pageSizeValidation,
  searchLoginTermValidation,
  searchEmailTermValidation,
  usersController.getAllUsers,
);

usersRouter.post(
  '/',
  authController.basicAuth,
  loginValidation,
  newPasswordValidation,
  emailValidation,
  usersController.createUser,
);

usersRouter.delete('/:id', authController.basicAuth, usersController.deleteUser);
