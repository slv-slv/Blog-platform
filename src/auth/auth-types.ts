export type JwtPayloadType = {
  userId: string;
  iat: number;
};

export type JwtPairType = {
  accessToken: string;
  refreshToken: string;
};
