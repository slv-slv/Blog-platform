import { credentials } from './credentials.js';

export const checkAuth = (authHeader: string): boolean => {
  const [, authReqBase64] = authHeader.split(' ');
  return credentials.map((user) => user.base64).includes(authReqBase64);
};
