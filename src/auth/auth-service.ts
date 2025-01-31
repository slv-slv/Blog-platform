import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { usersQueryRepo } from '../features/users/users-query-repo.js';
import { SETTINGS } from '../settings.js';
import { JwtPairType, JwtPayloadType } from './auth-types.js';

export const authService = {
  hashPassword: async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  },

  checkPassword: async (loginOrEmail: string, password: string): Promise<boolean> => {
    const hash = await usersQueryRepo.getPasswordHash(loginOrEmail);
    if (!hash) {
      return false;
    }
    return await bcrypt.compare(password, hash);
  },

  issueJwtPair: async (loginOrEmail: string): Promise<JwtPairType> => {
    const user = await usersQueryRepo.findUser(loginOrEmail);
    const userId = user!.id;
    const payload = { userId };
    const secret = SETTINGS.JWT_PRIVATE_KEY!;
    const accessToken = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '10 s' });
    const refreshToken = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '20 s' });
    return { accessToken, refreshToken };
  },

  verifyJwt: (token: string): JwtPayloadType | null => {
    try {
      return jwt.verify(token, SETTINGS.JWT_PRIVATE_KEY!) as JwtPayloadType;
    } catch {
      return null;
    }
  },
};
