import { Hono } from 'hono'

import { errorMiddleware } from './middlewares/error.middleware'
import { categoryRouter } from './modules/category/category.router'

const app = new Hono()

// Root routes
app.get('/', (c) => c.json({ message: 'Welcome to pawship server!' }))

// Category routes
app.route('/categories', categoryRouter)

// Error handling middleware
app.onError(errorMiddleware)

export default app