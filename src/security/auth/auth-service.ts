import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SETTINGS } from '../../settings.js';
import { JwtAcessPayload, JwtPairType, JwtRefreshPayload } from './auth-types.js';
import { usersQueryRepo } from '../../instances/repositories.js';
import { sessionsService } from '../../instances/services.js';

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

  async generateJwtPair(
    userId: string,
    deviceId: string,
    deviceName: string,
    ip: string,
  ): Promise<JwtPairType> {
    const jwtAccessPayload = { userId };
    const jwtRefreshPayload = { userId, deviceId };
    const secret = SETTINGS.JWT_PRIVATE_KEY!;

    const accessToken = jwt.sign(jwtAccessPayload, secret, { algorithm: 'HS256', expiresIn: '10 s' });
    const refreshToken = jwt.sign(jwtRefreshPayload, secret, { algorithm: 'HS256', expiresIn: '20 s' });

    const { iat, exp } = jwt.decode(refreshToken) as JwtRefreshPayload;
    await sessionsService.createSession(userId, deviceId, deviceName, ip, iat, exp);

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
