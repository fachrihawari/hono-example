import type { ErrorHandler } from "hono"
import { HTTPException } from "hono/http-exception"
import type { BlankEnv } from "hono/types"


export const errorMiddleware: ErrorHandler<BlankEnv> = (err, c) => {
  if (err instanceof HTTPException) {
    // Get the custom response
    return c.json({ message: err.message, errors: err.cause }, err.status)
  }

  return c.json({ message: "Internal Server Error" }, 500)
}