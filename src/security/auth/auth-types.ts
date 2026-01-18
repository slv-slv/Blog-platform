import jwt from 'jsonwebtoken';

export interface JwtAcessPayload extends jwt.JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}

export interface JwtRefreshPayload extends jwt.JwtPayload {
  sub: string;
  deviceId: string;
  iat: number;
  exp: number;
}

export type JwtPairType = {
  accessToken: string;
  refreshToken: string;
};
