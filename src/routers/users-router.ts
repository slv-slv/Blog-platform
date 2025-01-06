import { Router } from 'express';
import { usersController } from '../controllers/users-controller.js';
import { checkBasicAuth } from '../authorization/basic-auth.js';
import {
  pageNumberValidation,
  pageSizeValidation,
  sortDirectionValidation,
  usersSortByValidation,
} from '../validation/pagination-params-validation.js';
import {
  emailValidation,
  loginValidation,
  newPasswordValidation,
  searchEmailTermValidation,
  searchLoginTermValidation,
} from '../validation/users-validation.js';

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
