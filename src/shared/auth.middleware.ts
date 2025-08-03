import { User } from '~/user/user.model';
import { HTTPException } from 'hono/http-exception';
import type { Context, Next } from 'hono';
import { verifyToken } from './jwt.helper';

// Middleware to check authentication using JWT
// We're not using the built-in jwt middleware here
// because we want to handle the user lookup ourselves.
// This allows us to attach the user to the context if needed.
export const authMiddleware = async (c: Context, next: Next) => {
  // Check for JWT token
  const authorization = c.req.header('Authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Invalid token' });
  }

  const token = authorization.replace('Bearer ', '');
  const payload = await verifyToken(token);

  if (!payload || !payload.sub)
    throw new HTTPException(401, { message: 'Invalid token' });

  // Check user existence
  const user = await User.find(payload.sub);
  if (!user) throw new HTTPException(401, { message: 'Invalid token' });

  // Attach user to context
  c.set('user', user);

  return next();
};
