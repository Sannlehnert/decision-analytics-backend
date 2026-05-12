import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import supertest from 'supertest';
import app from '../../index.js';
import baseDatos from '../../config/baseDatos.js';

const request = supertest(app);
let token;

beforeAll(async () => {
  await baseDatos('resultados').del();
  await baseDatos('decisiones').del();
  await baseDatos('usuarios').del();

  await request.post('/api/auth/registro').send({ email: 'demo@ejemplo.com', clave: '12345678' });
  const loginRes = await request.post('/api/auth/login').send({ email: 'demo@ejemplo.com', clave: '12345678' });
  token = loginRes.body.token;
});

afterAll(async () => {
  await baseDatos.destroy();
});

describe('Autenticación', () => {
  test('POST /api/auth/registro devuelve 201', async () => {
    const uniqueEmail = `test_${Date.now()}@mail.com`;
    const res = await request
      .post('/api/auth/registro')
      .send({ email: uniqueEmail, clave: '12345678' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  test('POST /api/auth/login devuelve token', async () => {
    const res = await request.post('/api/auth/login').send({ email: 'demo@ejemplo.com', clave: '12345678' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});

describe('Decisiones', () => {
  test('GET /api/decisiones sin token devuelve 401', async () => {
    const res = await request.get('/api/decisiones');
    expect(res.status).toBe(401);
  });

  test('POST /api/decisiones con token crea decisión', async () => {
    const res = await request
      .post('/api/decisiones')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Nueva decisión de test', categoria: 'trabajo' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.estado).toBe('pendiente');
  });

  test('PUT /api/decisiones/:id cerrar sin resultado falla', async () => {
    // Crear decisión para el test
    await request
      .post('/api/decisiones')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Decisión a cerrar', categoria: 'personal' });
    
    // Obtener el ID de la lista
    const listRes = await request
      .get('/api/decisiones')
      .set('Authorization', `Bearer ${token}`);
    const id = listRes.body[0].id;  // El array está ordenado por creado_en desc, el primero es el recién creado
    
    // Intentar cerrar sin resultado
    const res = await request
      .put(`/api/decisiones/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ estado: 'cerrada' });
    
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/sin registrar un resultado/);
  });
});