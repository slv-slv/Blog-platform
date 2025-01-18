import { Router } from 'express';
import { usersController } from './users-controller.js';
import { checkBasicAuth } from '../authorization/basic-auth.js';
import {
  pageNumberValidation,
  pageSizeValidation,
  sortDirectionValidation,
  usersSortByValidation,
} from '../validation/paging-params-validation.js';
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
  checkBasicAuth,
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
  checkBasicAuth,
  loginValidation,
  newPasswordValidation,
  emailValidation,
  usersController.createUser,
);

usersRouter.delete('/:id', checkBasicAuth, usersController.deleteUser);
