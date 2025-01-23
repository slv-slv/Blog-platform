import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { usersRepo } from '../features/users/users-repo.js';
import { usersViewModelRepo } from '../features/users/users-view-model-repo.js';
import { SETTINGS } from '../settings.js';
import { JwtPayloadType } from './auth-types.js';

export const authService = {
  hashPassword: async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  },

  checkPassword: async (loginOrEmail: string, password: string): Promise<boolean> => {
    const hash = await usersRepo.getPasswordHash(loginOrEmail);
    if (!hash) {
      return false;
    }
    return await bcrypt.compare(password, hash);
  },

  issueJWT: async (loginOrEmail: string): Promise<string> => {
    const user = await usersViewModelRepo.findUser(loginOrEmail);
    const userId = user.id;
    const payload = { userId };
    const secret = SETTINGS.JWT_PRIVATE_KEY!;
    const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15 m' });
    return token;
  },

  verifyJWT: (token: string): JwtPayloadType | null => {
    try {
      return jwt.verify(token, SETTINGS.JWT_PRIVATE_KEY!) as JwtPayloadType;
    } catch {
      return null;
    }
  },
};
