import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../main';
import type { ICategory } from './category.model';
import { DB } from 'mongoloquent';

describe('Category API integration', () => {
  beforeAll(async () => {
    console.log('Setting up test database...');
    await DB.collection('categories').insert({
      name: 'TestCategory',
    });
  });

  afterAll(async () => {
    console.log('Cleaning up test database...');
    await DB.collection('categories').delete({});
  });

  it('GET /categories should return all categories', async () => {
    const res = await app.request('/categories');
    expect(res.status).toBe(200);

    const data = (await res.json()) as ICategory[];
    expect(data).toBeInstanceOf(Array);
    expect(data).toHaveLength(1);
    expect(data[0]).toHaveProperty('name', 'TestCategory');
  });

  let createdId: string;

  it('POST /categories should create a category', async () => {
    const res = await app.request('/categories', {
      method: 'POST',
      body: JSON.stringify({ name: 'AnotherCategory' }),
      headers: { 'Content-Type': 'application/json' },
    });
    // Check response
    expect(res.status).toBe(201);
    const data = (await res.json()) as ICategory;
    expect(data).toBeInstanceOf(Object);
    expect(data).toHaveProperty('name', 'AnotherCategory');
    expect(data).toHaveProperty('_id');
    createdId = data._id.toString();

    // Confirm the creation
    const createdData = await DB.collection('categories').find(createdId);
    expect(createdData).toBeDefined();
    expect(createdData).toHaveProperty('name', 'AnotherCategory');
  });
  it('POST /categories should return 400 for missing name', async () => {
    const res = await app.request('/categories', {
      method: 'POST',
      body: JSON.stringify({}), // missing name
      headers: { 'Content-Type': 'application/json' },
    });

    // Check response
    expect(res.status).toBe(400);
    const data = (await res.json()) as {
      message: string;
      errors: Record<string, string>;
    };
    expect(data).toHaveProperty('message', 'Validation failed');
    expect(data).toHaveProperty('errors', expect.any(Object));
    expect(data.errors).toHaveProperty('name', 'Name is required');
  });
  it('should return 400 for short name', async () => {
    const res = await app.request('/categories', {
      method: 'POST',
      body: JSON.stringify({ name: 'ab' }), // short name
      headers: { 'Content-Type': 'application/json' },
    });

    // Check response
    expect(res.status).toBe(400);
    const data = (await res.json()) as {
      message: string;
      errors: Record<string, string>;
    };
    expect(data).toHaveProperty('message', 'Validation failed');
    expect(data).toHaveProperty('errors', expect.any(Object));
    expect(data.errors).toHaveProperty(
      'name',
      'Name must be at least 3 characters long',
    );
  });

  it('GET /categories/:id should return a category', async () => {
    const res = await app.request(`/categories/${createdId}`);
    expect(res.status).toBe(200);
    const data = (await res.json()) as ICategory;
    expect(data).toHaveProperty('name', 'AnotherCategory');
    expect(data).toHaveProperty('_id', createdId);
  });

  it('PUT /categories/:id should update a category', async () => {
    const res = await app.request(`/categories/${createdId}`, {
      method: 'PUT',
      body: JSON.stringify({ name: 'UpdatedCategory' }),
      headers: { 'Content-Type': 'application/json' },
    });

    // Check response
    expect(res.status).toBe(200);
    const data = (await res.json()) as ICategory;
    expect(data).toHaveProperty('_id', createdId);
    expect(data).toHaveProperty('name', 'UpdatedCategory');

    // Confirm the update
    const updatedData = await DB.collection('categories').find(createdId);
    expect(updatedData).toHaveProperty('name', 'UpdatedCategory');
  });

  it('DELETE /categories/:id should delete a category', async () => {
    const res = await app.request(`/categories/${createdId}`, {
      method: 'DELETE',
    });

    // Check response
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('message', 'Category deleted');

    // Confirm deletion
    const deletedData = await DB.collection('categories').find(createdId);
    expect(deletedData).toBeNull();
  });
});
