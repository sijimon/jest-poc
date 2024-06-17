// @ts-ignore
import request from 'supertest';
// @ts-ignore
import { app, server } from './app';

describe('Users API', () => {
  afterAll(() => {
    server.close();
  });

    
  it('should create a new user', async () => {
    const newUser = { name: 'Alice', email: 'alice@example.com' };
    const response = await request(app).post('/users').send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
  });

  it('should get all users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a user by ID', async () => {
    const response = await request(app).get('/users/1');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
  });

  it('should update a user', async () => {
    const updatedUser = { name: 'John Updated', email: 'john.updated@example.com' };
    const response = await request(app).put('/users/1').send(updatedUser);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedUser.name);
    expect(response.body.email).toBe(updatedUser.email);
  });

  it('should delete a user', async () => {
    const response = await request(app).delete('/users/1');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
  });
});