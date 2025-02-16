import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SETTINGS } from '../../settings.js';
import { JwtAcessPayload, JwtPairType, JwtRefreshPayload } from './auth-types.js';
import { inject, injectable } from 'inversify';
import { UsersQueryRepo } from '../../features/users/users-query-repo.js';

@injectable()
export class AuthService {
  constructor(@inject(UsersQueryRepo) private usersQueryRepo: UsersQueryRepo) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
    const hash = await this.usersQueryRepo.getPasswordHash(loginOrEmail);
    if (!hash) {
      return false;
    }
    return await bcrypt.compare(password, hash);
  }

  async generateJwtPair(userId: string, deviceId: string): Promise<JwtPairType> {
    const jwtAccessPayload = { userId };
    const jwtRefreshPayload = { userId, deviceId };
    const secret = SETTINGS.JWT_PRIVATE_KEY!;

    const accessToken = jwt.sign(jwtAccessPayload, secret, { algorithm: 'HS256', expiresIn: '10 s' });
    const refreshToken = jwt.sign(jwtRefreshPayload, secret, { algorithm: 'HS256', expiresIn: '20 s' });

    return { accessToken, refreshToken };
  }

  verifyJwt(token: string): JwtAcessPayload | JwtRefreshPayload | null {
    try {
      return jwt.verify(token, SETTINGS.JWT_PRIVATE_KEY!) as JwtAcessPayload | JwtRefreshPayload;
    } catch {
      return null;
    }
  }
}
