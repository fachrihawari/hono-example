import type { Context } from 'hono';
import { Category } from './category.model';
import { HTTPException } from 'hono/http-exception';

class CategoryController {
  async all(c: Context) {
    const categories = await Category.all();
    return c.json(categories);
  }

  async show(c: Context) {
    const id = c.req.param('id');
    const category = await Category.find(id);
    if (!category) {
      throw new HTTPException(404, { message: 'Category not found' });
    }
    return c.json(category);
  }

  async store(c: Context) {
    const body = await c.req.json();
    const category = await Category.create(body);
    return c.json(category, 201);
  }

  async update(c: Context) {
    const id = c.req.param('id');
    const body = await c.req.json();
    const category = await Category.find(id);
    if (!category) {
      throw new HTTPException(404, { message: 'Category not found' });
    }
    const updated = await category.update(body);
    return c.json(updated);
  }

  async delete(c: Context) {
    const id = c.req.param('id');
    const category = await Category.find(id);
    if (!category) {
      throw new HTTPException(404, { message: 'Category not found' });
    }
    await category.delete();
    return c.json({ message: 'Category deleted' });
  }
}

export const categoryController = new CategoryController();
