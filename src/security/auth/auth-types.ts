import jwt from 'jsonwebtoken';

export interface JwtAcessPayload extends jwt.JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

export interface JwtRefreshPayload extends jwt.JwtPayload {
  userId: string;
  deviceId: string;
  iat: number;
  exp: number;
}

export type JwtPairType = {
  accessToken: string;
  refreshToken: string;
};
