import { Result, ValidationError } from 'express-validator';
import { ErrorType } from '../types/error-types.js';

export const formatErrors = (errors: Result<ValidationError>): ErrorType[] => {
  return errors.array({ onlyFirstError: true }).map((err) => {
    const message = err.msg;
    if ('param' in err) {
      const field = err.param;
    }
    const field = '';
    return { message, field };
  });
};