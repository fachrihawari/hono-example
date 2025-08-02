import { Hono } from 'hono'
import { logger } from 'hono/logger'

import { authRouter } from './modules/auth/auth.router'
import { errorMiddleware } from './middlewares/error.middleware'
import { categoryRouter } from './modules/category/category.router'
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'

const app = new Hono()

// Global middlewares
app.use(logger())
app.use(cors())
app.use(prettyJSON())

// Root routes
app.get('/', (c) => c.json({ message: 'Welcome to pawship server!' }))

// Auth routes
app.route('/auth', authRouter)
// Category routes
app.route('/categories', categoryRouter)

// Error handling middleware
app.onError(errorMiddleware)

export default app