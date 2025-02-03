import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { usersQueryRepo } from '../features/users/users-query-repo.js';
import { SETTINGS } from '../settings.js';
import { JwtPairType, JwtPayloadType } from './auth-types.js';
import { sessionsService } from '../features/sessions/sessions-service.js';

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(loginOrEmail: string, password: string): Promise<boolean> {
    const hash = await usersQueryRepo.getPasswordHash(loginOrEmail);
    if (!hash) {
      return false;
    }
    return await bcrypt.compare(password, hash);
  }

  async issueJwtPair(userId: string): Promise<JwtPairType> {
    const payload = { userId };
    const secret = SETTINGS.JWT_PRIVATE_KEY!;
    const accessToken = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '10 s' });
    const refreshToken = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '20 s' });

    const issuedJwtPayload = jwt.decode(refreshToken) as jwt.JwtPayload;
    const iat = issuedJwtPayload.iat!;
    await sessionsService.createSession(userId, iat);

    return { accessToken, refreshToken };
  }

  verifyJwt(token: string): JwtPayloadType | null {
    try {
      return jwt.verify(token, SETTINGS.JWT_PRIVATE_KEY!) as JwtPayloadType;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
