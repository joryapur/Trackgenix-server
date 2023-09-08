import request from 'supertest';
import app from '../app';
import SuperAdmins from '../models/Super-admins';
import superAdminsSeed from '../seed/super-admin';

const nonExistentId = '635316fe464e1ad6227622e5';
const wrongFormantId = '635692a4b69e81299811c';
const id = '635316fe464e1ad6227622e4';
const invalidId = '635316fe464e1';
const inexistentId = '635316fe464e1ad6227622e7';
const mockedSuperAdmin = {
  firstName: 'Pepito',
  lastName: 'Perez',
  email: 'pepitoperez@gmail.com',
  password: 'pepitoperezpw',
  phone: '222666555',
  location: 'Calle falsa 123',
  dni: '25556665',
};
const mockedIncompleteSuperAdmin = {
  lastName: 'Perez',
  email: 'pepitoperez@gmail.com',
  password: 'pepitoperezpw',
  phone: '222666555',
  location: 'Calle falsa 123',
  dni: '25556665',
};
const mockedWrongSuperAdmin = {
  firstName: '555555',
  lastName: 'Perez',
  email: 'pepitoperez@gmail.com',
  password: 'pepitoperezpw',
  phone: '222666555',
  location: 'Calle falsa 123',
  dni: '25556665',
};

beforeAll(async () => {
  await SuperAdmins.collection.insertMany(superAdminsSeed);
});

describe('GET /super-admins', () => {
  test('should return status code 200', async () => {
    const response = await request(app).get('/super-admins').send();

    expect(response.status).toBe(200);
  });
  test('should return a list of employees', async () => {
    const response = await request(app).get('/super-admins').send();

    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.message).toBe('Super Admins found');
  });
  test('should return empty list of employees', async () => {
    await request(app).delete(`/super-admins/${id}`);
    const response = await request(app).get('/super-admins').send();

    expect(response.status).toBe(404);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message).toBe('Super admins not found');
    await SuperAdmins.collection.insertMany(superAdminsSeed);
  });
});

describe('POST /super-admins', () => {
  test('should create an super admin', async () => {
    const response = await request(app).post('/super-admins').send(mockedSuperAdmin);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Super admins created successfully');
    expect(response.body.error).toBeFalsy();
    expect(response.body.data.firstName).toBe(mockedSuperAdmin.firstName);
    expect(response.body.data.email).toBe(mockedSuperAdmin.email);
    expect(response.body.data.dni).toBe(mockedSuperAdmin.dni);
    expect(response.body.data.phone).toBe(mockedSuperAdmin.phone);
  });
  test('should not create an super admin', async () => {
    const response = await request(app).post('/super-admins').send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message[0].message).toBe('first name required');
    expect(response.body.message[1].message).toBe('last name required');
    expect(response.body.message[2].message).toBe('email required');
    expect(response.body.message[3].message).toBe('password required');
    expect(response.body.message[4].message).toBe('dni required');
    expect(response.body.data).toBe(undefined);
  });
  test('the super admin should have a name', async () => {
    const response = await request(app).post('/super-admins').send({ ...mockedSuperAdmin, firstName: undefined });

    expect(response.status).toBe(400);
    expect(response.body.message.length).toBe(1);
    expect(response.body.message[0].message).toBe('first name required');
  });
  test('the super admin should have a last mame', async () => {
    const response = await request(app).post('/super-admins').send({ ...mockedSuperAdmin, lastName: undefined });

    expect(response.status).toBe(400);
    expect(response.body.message.length).toBe(1);
    expect(response.body.message[0].message).toBe('last name required');
  });
  test('the super admin should have an email', async () => {
    const response = await request(app).post('/super-admins').send({ ...mockedSuperAdmin, email: undefined });

    expect(response.status).toBe(400);
    expect(response.body.message.length).toBe(1);
    expect(response.body.message[0].message).toBe('email required');
  });
  test('the super admin should have a password', async () => {
    const response = await request(app).post('/super-admins').send({ ...mockedSuperAdmin, password: undefined });

    expect(response.status).toBe(400);
    expect(response.body.message.length).toBe(1);
    expect(response.body.message[0].message).toBe('password required');
  });
  test('the super admin should have a dni', async () => {
    const response = await request(app).post('/super-admins').send({ ...mockedSuperAdmin, dni: undefined });

    expect(response.status).toBe(400);
    expect(response.body.message.length).toBe(1);
    expect(response.body.message[0].message).toBe('dni required');
  });
});

describe('GET /super-admins/id', () => {
  test('should return status code 200', async () => {
    const response = await request(app).get(`/super-admins/${id}`);

    expect(response.status).toBe(200);
  });
  test('should return dont exist this Id', async () => {
    const response = await request(app).get(`/super-admins/${nonExistentId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message).toBe(`Couldn't find super admin with id ${nonExistentId}`);
    expect(response.body.data).toBe(undefined);
  });
  test('should not get a super admin when the id has the wrong format', async () => {
    const response = await request(app).get(`/super-admins/${wrongFormantId}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message).toBe(`Invalid id: ${wrongFormantId}`);
    expect(response.body.data).toBe(undefined);
  });
});

describe('PUT Endpoints', () => {
  test('Should fail to modify a super admin because incomplete body', async () => {
    const response = await request(app).put(`/super-admins/${id}`).send(mockedIncompleteSuperAdmin);
    expect(response.status).toBe(400);
    expect(response.body.message[0].message).toBe('first name required');
    expect(response.body.data).toBe(undefined);
    expect(response.body.error).toBeTruthy();
  });

  test('Should fail to modify a super admin because invalid body', async () => {
    const response = await request(app).put(`/super-admins/${id}`).send(mockedWrongSuperAdmin);

    expect(response.status).toBe(400);
    expect(response.body.message[0].message).toBe('first name should be letters only');
    expect(response.body.data).toBe(undefined);
    expect(response.body.error).toBeTruthy();
  });

  test('Should fail to modify a super admin because invalid ID', async () => {
    const response = await request(app).put(`/super-admins/${invalidId}`).send(mockedSuperAdmin);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`Invalid id: ${invalidId}`);
    expect(response.body.error).toBeTruthy();
  });
  test('Should fail to modify a super admin because inexistent id', async () => {
    const response = await request(app).put(`/super-admins/${inexistentId}`).send(mockedSuperAdmin);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`Couldn't find super admin with id ${inexistentId}`);
    expect(response.body.error).toBeTruthy();
  });
  test('Should modify a super admin', async () => {
    const response = await request(app).put(`/super-admins/${id}`).send(mockedSuperAdmin);

    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.message).toBe(`Modified super admin with id ${id}`);
  });
});

describe('DELETE Endpoints', () => {
  test('Should fail to delete a super admin because invalid ID', async () => {
    const response = await request(app).delete(`/super-admins/${invalidId}`).send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`Invalid id: ${invalidId}`);
    expect(response.body.error).toBeTruthy();
  });
  test('Should fail to delete a super admin because inexistent id', async () => {
    const response = await request(app).delete(`/super-admins/${inexistentId}`).send();

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`Couldn't find super admin with id ${inexistentId}`);
    expect(response.body.error).toBeTruthy();
  });
  test('Should delete a super admin', async () => {
    const response = await request(app).delete(`/super-admins/${id}`).send();

    expect(response.status).toBe(204);
  });
});
