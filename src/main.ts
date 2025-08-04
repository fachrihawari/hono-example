import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';

import { authRouter } from './auth/auth.router';
import { categoryRouter } from './category/category.router';
import { errorMiddleware } from './shared/error.middleware';

const app = new Hono();

// Global middlewares
app.use(logger());
app.use(cors());
app.use(prettyJSON());

// Root routes
app.get('/', (c) => c.json({ message: 'Welcome to pawship server!' }));

// Auth routes
app.route('/auth', authRouter);
// Category routes
app.route('/categories', categoryRouter);

// Error handling middleware
app.onError(errorMiddleware);

export default app;
