import { Hono } from "hono";
import { zValidator } from "~/libraries/zod-validatior.library";
import { authController } from "./auth.controller";
import { loginSchema } from "./auth.schema";

const authRouter = new Hono();

authRouter.post("/login", zValidator('json', loginSchema), authController.login);

export { authRouter };