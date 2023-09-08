/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import app from '../app';
import Admin from '../models/Admins';
import adminsSeed from '../seed/admins';

const mockedAdmin = {
  firstName: 'Caroline',
  lastName: 'River',
  email: 'carolineriver@gmail.com',
  password: 'kdjjfun45874',
  dni: '20458785',
  phone: '1168554785',
  location: 'Buenos Aires',
};

const mockedAdminModified = {
  firstName: 'Mario',
  lastName: 'Bros',
  email: 'Mariobros@gmail.com',
  password: 'passwordreseguro',
  dni: '12345678',
  phone: '1168542425',
  location: 'California',
};

const mockedAdminInvalid = {
  firstName: 'a',
  lastName: 'Hills',
  email: 'Mariobros@gmail.com',
  password: 'Axhvbhd7844',
  dni: '30457895',
  phone: '1168542485',
  location: 'Montana',
};

const firstAdminId = adminsSeed[0]._id;
const invalidId = '456';
const invalidAdminId = '62731244ec6456efd12685ef';
let newAdminId;

beforeAll(async () => {
  await Admin.collection.insertMany(adminsSeed);
});

describe('DELETE /admins', () => {
  test('should return status code 204', async () => {
    const response = await request(app).delete(`/admins/${firstAdminId}`).send();
    expect(response.status).toBe(204);
  });
  test('should return 400', async () => {
    const response = await request(app).delete(`/admins/${invalidId}`).send();
    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message).toBe(`Invalid id: ${invalidId}`);
  });
  test('should return 404', async () => {
    const response = await request(app).delete(`/admins/${firstAdminId}`).send();
    expect(response.status).toBe(404);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message).toBe(`Couldn't find admin with id ${firstAdminId}`);
  });
});

describe('POST /admin', () => {
  test('everything correct: return status code 201', async () => {
    const res = await request(app).post('/admins/').send(mockedAdmin);
    // eslint-disable-next-line no-underscore-dangle
    newAdminId = res.body.data._id;
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Admin created successfully');
    expect(res.body.error).toBeFalsy();
  });
  test('validations: return status code 400', async () => {
    mockedAdmin.firstName = '';
    const res = await request(app).post('/admins/').send(mockedAdmin);
    expect(res.status).toBe(400);
    expect(res.body.message[0].message).toBe('first name required');
    expect(res.body.error).toBeTruthy();
  });
});

describe('PUT /admins', () => {
  test('should return status code 200', async () => {
    const response = await request(app).put(`/admins/${newAdminId}`).send(mockedAdminModified);
    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.message).toBe(`Modified admin with id ${newAdminId}`);
  });
  test('should return status code 400', async () => {
    const response = await request(app).put(`/admins/${invalidId}`).send(mockedAdminModified);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message).toBe(`Invalid id: ${invalidId}`);
  });
  test('should return status code 404', async () => {
    const response = await request(app).put(`/admins/${invalidAdminId}`).send(mockedAdminModified);
    expect(response.status).toBe(404);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message).toBe(`Couldn't find admin with id ${invalidAdminId}`);
  });
  test('should return status code 400 validate error', async () => {
    const response = await request(app).put(`/admins/${newAdminId}`).send(mockedAdminInvalid);
    expect(response.status).toBe(400);
    expect(response.body.message[0].message).toBe('first name should have a minimum length of 2 characters');
    expect(response.error).toBeTruthy();
  });
});

describe('GET /admin/:id', () => {
  test('everything correct: return status code 200', async () => {
    const res = await request(app).get(`/admins/${newAdminId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe(`Found admin with id ${newAdminId}`);
    expect(res.body.error).toBeFalsy();
  });
  test('invalid id: return status code 400', async () => {
    const res = await request(app).get('/admins/42');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid id: 42');
    expect(res.body.error).toBeTruthy();
  });
  test('id does not exist: return status code 404', async () => {
    const res = await request(app).delete(`/admins/${invalidAdminId}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe(`Couldn't find admin with id ${invalidAdminId}`);
    expect(res.body.error).toBeTruthy();
  });
});

describe('GET /admin', () => { // leave GET at the end when merging (second test deletes only item on DB)
  test('everything correct: return status code 200', async () => {
    const res = await request(app).get('/admins/');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Admins found');
    expect(res.body.error).toBeFalsy();
  });
  test('no admins: return status code 404', async () => { // delete this line when merging
    await request(app).delete(`/admins/${newAdminId}`);
    const res = await request(app).get('/admins/');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Admins not found');
    expect(res.body.error).toBeTruthy();
  });
});
