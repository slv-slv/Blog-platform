import { PagingParams } from '../../common/types/paging-params';

declare global {
  namespace Express {
    interface Request {
      userId: string | null;
      deviceId?: string;
      iat?: number;
      exp?: number;
      pagingParams?: PagingParams;
    }
  }
}
