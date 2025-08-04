import type { ZodType } from 'zod';
import type { ValidationTargets } from 'hono';
import { zValidator as zv } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';

export const zValidator = <
  T extends ZodType,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) =>
  zv(target, schema, (result) => {
    if (!result.success) {
      const cause = result.error.issues.reduce(
        (issue: Record<string, string>, c) => {
          issue[c.path.join('.')] = c.message;
          return issue;
        },
        {},
      );
      throw new HTTPException(400, { message: 'Validation failed', cause });
    }
  });
