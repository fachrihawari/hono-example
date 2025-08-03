import type { Context } from 'hono';
import { User } from '~/user/user.model';
import { HTTPException } from 'hono/http-exception';
import { signToken } from '~/shared/jwt.helper';

class AuthController {
  async login(c: Context) {
    const { email, password } = await c.req.json();

    // Check if user exists
    const user = await User.where('email', email).first();
    if (!user) {
      throw new HTTPException(401, { message: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await Bun.password.verify(password, user.password);
    if (!isPasswordValid) {
      throw new HTTPException(401, { message: 'Invalid email or password' });
    }

    // Generate access token
    const accessToken = await signToken({ sub: user._id.toString() });

    return c.json({ accessToken });
  }
}

export const authController = new AuthController();
