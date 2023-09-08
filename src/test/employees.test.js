/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import app from '../app';
import Employee from '../models/Employees';
import employeesSeed from '../seed/employees';

const firstEmployeeIdFromSeed = employeesSeed[0]._id;
const invalidId = 123;
const employeeId = '63531244ec6456efd12685ef';
const notExistId = '03034564ec6456efd12675ef';
let newId;

const mockedEmployee = {
  firstName: 'George',
  lastName: 'DelaSelva',
  email: 'GeorgeDelaSelva@gmail.com',
  password: 'notTarzan1234',
  dni: '30454595',
  phone: '1165642485',
  location: 'Laselva',
};

const mockedEmployeeModified = {
  firstName: 'Carlos',
  lastName: 'Guevara',
  email: 'CarlosGuevara@gmail.com',
  password: 'passwordreseguro',
  dni: '12345678',
  phone: '1168542425',
  location: 'Miame',
};

const mockedEmployeeInvalid = {
  firstName: 'Carlos',
  lastName: 'Hills',
  email: '',
  password: 'Axhvbhd7844',
  dni: '30457895',
  phone: '1168542485',
  location: 'Montana',
};

beforeAll(async () => {
  await Employee.collection.insertMany(employeesSeed);
});

describe('Delete/employees', () => {
  test('should return status code 204', async () => {
    const response = await request(app).delete(`/employees/${firstEmployeeIdFromSeed}`).send();
    expect(response.status).toBe(204);
  });
  test('should return 400', async () => {
    const response = await request(app).delete(`/employees/${invalidId}`).send();
    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message).toBe(`Invalid id: ${invalidId}`);
  });
  test('should return 404', async () => {
    const response = await request(app).delete(`/employees/${firstEmployeeIdFromSeed}`).send();
    expect(response.status).toBe(404);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message).toBe(`Couldn't find employee with id ${firstEmployeeIdFromSeed}`);
  });
});

describe('POST /employees', () => {
  test('should create new employee', async () => {
    const response = await request(app).post('/employees/').send(mockedEmployee);
    // eslint-disable-next-line no-underscore-dangle
    newId = response.body.data._id;
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Employee created successfully');
    expect(response.body.error).toBeFalsy();
  });
  test('shouldn\'t create employee', async () => {
    mockedEmployee.password = '';
    const response = await request(app).post('/employees/').send(mockedEmployee);
    expect(response.status).toBe(400);
    expect(response.body.message[0].message).toBe('password required');
    expect(response.error).toBeTruthy();
  });
});

describe('Put/employees', () => {
  test('should return status code 200', async () => {
    const response = await request(app).put(`/employees/${newId}`).send(mockedEmployeeModified);
    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.message).toBe(`Modified employee with id ${newId}`);
  });
  test('should return status code 400', async () => {
    const response = await request(app).put(`/employees/${invalidId}`).send(mockedEmployeeModified);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message).toBe(`Invalid id: ${invalidId}`);
  });
  test('should return status code 404', async () => {
    const idThatNotexist = '62731244ec6456efd12685ef';
    const response = await request(app).put(`/employees/${idThatNotexist}`).send(mockedEmployeeModified);
    expect(response.status).toBe(404);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message).toBe(`Couldn't find employee with id ${idThatNotexist}`);
  });
  test('should return status code 400 validate error', async () => {
    const response = await request(app).put(`/employees/${newId}`).send(mockedEmployeeInvalid);
    expect(response.status).toBe(400);
    expect(response.body.message[0].message).toBe('email required');
    expect(response.error).toBeTruthy();
  });
});

describe('GET /employees/:id', () => {
  test('should GET an employee by Id', async () => {
    const response = await request(app).get(`/employees/${newId}`).send();
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(`Found employee with id ${newId}`);
    expect(response.body.error).toBeFalsy();
  });
  test('should not GET, invalid Id', async () => {
    const response = await request(app).get(`/employees/${invalidId}`).send();
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`Invalid id: ${invalidId}`);
    expect(response.body.data).toEqual(undefined);
    expect(response.body.error).toBeTruthy();
  });
  test('should not GET, non-existent Id', async () => {
    const response = await request(app).get(`/employees/${notExistId}`).send();
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`Couldn't find employee with id ${notExistId}`);
    expect(response.body.data).toBe(undefined);
    expect(response.body.error).toBeTruthy();
  });
});

describe('GET /employees', () => {
  test('should GET employees', async () => {
    const response = await request(app).get('/employees').send();
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Employees found');
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.error).toBeFalsy();
  });
  test('should not GET employees', async () => {
    await request(app).delete(`/employees/${employeeId}`);
    await request(app).delete(`/employees/${newId}`);
    const response = await request(app).get('/employees/');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Employees not found');
    expect(response.body.error).toBeTruthy();
  });
});
