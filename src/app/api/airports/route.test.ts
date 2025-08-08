const request = require('supertest');
const app = require('../../../app'); // Adjust the path as necessary

test('GET /api/airports should return a list of airports', async () => {
	const response = await request(app).get('/api/airports');
	expect(response.status).toBe(200);
	expect(Array.isArray(response.body)).toBe(true);
});

test('GET /api/airports/:id should return a specific airport', async () => {
	const response = await request(app).get('/api/airports/1');
	expect(response.status).toBe(200);
	expect(response.body).toHaveProperty('id', 1);
});

test('POST /api/airports should create a new airport', async () => {
	const newAirport = { name: 'Test Airport', code: 'TST' };
	const response = await request(app).post('/api/airports').send(newAirport);
	expect(response.status).toBe(201);
	expect(response.body).toHaveProperty('id');
	expect(response.body.name).toBe(newAirport.name);
});