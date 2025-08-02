import z from 'zod';

export const categorySchema = z.object({
  name: z
    .string('Name is required')
    .min(3, 'Name must be at least 3 characters long'),
});
