import type { Context } from "hono";
import { User } from "~/modules/user/user.model";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";

class AuthController {
  async login(c: Context) {
    const { email, password } = await c.req.json()

    const user = await User.where('email', email).first();

    if (!user) {
      throw new HTTPException(401, { message: 'Invalid email or password' });
    }

    const isPasswordValid = await Bun.password.verify(password, user.password);

    if (!isPasswordValid) {
      throw new HTTPException(401, { message: 'Invalid email or password' });
    }

    const accessToken = await sign({ _id: user._id }, Bun.env.JWT_SECRET)

    return c.json({ accessToken });
  }
}

export const authController = new AuthController();