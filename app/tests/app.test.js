const request = require('supertest');
const app = require('../src/index');

describe('API Tests', () => {
  test('GET / returns status ok', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /health returns healthy: true', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.healthy).toBe(true);
  });

  test('GET /metrics returns Prometheus payload', async () => {
    const res = await request(app).get('/metrics');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('process_cpu_user_seconds_total');
  });
});
