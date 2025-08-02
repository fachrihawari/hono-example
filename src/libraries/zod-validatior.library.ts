import z, { ZodType } from 'zod';
import type { ValidationTargets } from 'hono';
import { zValidator as zv } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import { is } from 'zod/locales';

export const zValidator = <
  T extends ZodType,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) =>
  zv(target, schema, (result, c) => {
    if (!result.success) {
      const cause = result.error.issues.reduce(
        (issue, c) => ({
          ...issue,
          [c.path.join('.')]: c.message,
        }),
        {},
      );
      throw new HTTPException(400, { message: 'Validation failed', cause });
    }
  });
