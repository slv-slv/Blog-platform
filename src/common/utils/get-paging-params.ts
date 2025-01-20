import { Request } from 'express';
import { PagingParams } from '../types/paging-params.js';
import { SETTINGS } from '../../settings.js';

export const getPagingParams = (req: Request): PagingParams => {
  const sortBy = req.query.sortBy ? req.query.sortBy : SETTINGS.PAGING_DEFAULT_PARAMS.sortBy;
  const sortDirection = req.query.sortDirection
    ? req.query.sortDirection
    : SETTINGS.PAGING_DEFAULT_PARAMS.sortDirection;
  const pageNumber = req.query.pageNumber ? +req.query.pageNumber : SETTINGS.PAGING_DEFAULT_PARAMS.pageNumber;
  const pageSize = req.query.pageSize ? +req.query.pageSize : SETTINGS.PAGING_DEFAULT_PARAMS.pageSize;

  const pagingParams = { sortBy, sortDirection, pageNumber, pageSize } as PagingParams;
  return pagingParams;
};
