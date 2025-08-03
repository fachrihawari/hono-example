import { sign, verify } from 'hono/jwt';
import type { JWTPayload } from 'hono/utils/jwt/types';

type JWTUserPayload = {
  sub: string; // User ID
} & JWTPayload;

export const signToken = (payload: JWTPayload) => {
  return sign(payload, Bun.env.JWT_SECRET);
};

export const verifyToken = async (token: string) => {
  return verify(token, Bun.env.JWT_SECRET) as Promise<JWTUserPayload>;
};
