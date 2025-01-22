import { RESULT_STATUS } from './result-status-codes.js';

type ExtensionType = {
  field: string | null;
  message: string;
};

export type Result<T = null> = {
  status: RESULT_STATUS;
  errorMessage?: string;
  extensions?: ExtensionType[];
  data: T;
};
