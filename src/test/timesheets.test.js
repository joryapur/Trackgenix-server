import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import Timesheets from '../models/Timesheets';
import timesheetsSeed from '../seed/timesheets';

beforeAll(async () => {
  await Timesheets.collection.insertMany(timesheetsSeed);
});

const mockedTimesheets = {
  date: '2022-10-22T00:00:00.000+00:00',
  task: '63531a7c73636855c2aa7f9a',
  description: 'Backend',
  project: '63531aaa2b654a3fb77054dd',
  employee: '63531244ec6456efd12685ef',
  hours: 10,
};

const correctMockedTimeSheet = {
  date: '2022-10-22T00:00:00.000+00:00',
  task: mongoose.Types.ObjectId('63531a7c73636855c2aa7f9a'),
  description: 'Backend',
  project: mongoose.Types.ObjectId('63531aaa2b654a3fb77054dd'),
  employee: mongoose.Types.ObjectId('63531244ec6456efd12685ef'),
  hours: 10,
};

const wrongMockedTimeSheet = {
  date: '2022-10-22T00:00:00.000+00:00',
  description: 'Backend',
  project: mongoose.Types.ObjectId('63531aaa2b654a3fb77054dd'),
  employee: mongoose.Types.ObjectId('63531244ec6456efd12685ef'),
  hours: 15,
};

let idTimesheet;
const timeSheetIdSeed = '63531fd7410c845909ab22e7';
const invalidId = '7777h5t';
const nonExistentId = '67534ff7410c845909ab22e7';
const timeSheetId = '63531fd7410c845909ab22e7';
const fakeTimeSheetId = '63531fd7410c845909ab22e6';
const wrongTimeSheetId = '1234fds';

describe('GET /time-sheets/:id', () => {
  test('Should return all time-sheets successfully', async () => {
    const response = await request(app).get(`/time-sheets/${timeSheetIdSeed}`);

    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.message).toBe('Found timesheet with id 63531fd7410c845909ab22e7');
  });

  test('Should return 404 status when there is no time-sheet with a valid id ', async () => {
    const response = await request(app).get(`/time-sheets/${nonExistentId}`).send();

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe(`Couldn't find timesheet with id ${nonExistentId}`);
  });

  test('Should return 400 status when a invalid id is received ', async () => {
    const response = await request(app).get(`/time-sheets/${invalidId}`).send();

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe(`Invalid id: ${invalidId}`);
  });
});

describe('UPDATE /timesheet', () => {
  test('Test on a success update', async () => {
    const response = await request(app).put(`/time-sheets/${timeSheetId}`).send(correctMockedTimeSheet);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(`Modified timesheet with id ${timeSheetId}`);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data).toBeDefined();
  });

  test('Test on a update with a incorrect format id', async () => {
    const response = await request(app).put(`/time-sheets/${wrongTimeSheetId}`).send(correctMockedTimeSheet);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`Invalid id: ${wrongTimeSheetId}`);
    expect(response.body.error).toBeTruthy();
  });

  test('Test on a update with wrong time sheet', async () => {
    const response = await request(app).put(`/time-sheets/${timeSheetId}`).send(wrongMockedTimeSheet);
    expect(response.status).toBe(400);
    expect(response.body.data).not.toBeDefined();
    expect(response.body.error).toBeTruthy();
    expect(response.body.message[0].message).toBe('"task" is required');
    expect(response.body.message[1].message).toBe('Maximum 12 hours');
  });

  test('Test on a update with an non existing employee', async () => {
    const response = await request(app).put(`/time-sheets/${fakeTimeSheetId}`).send(correctMockedTimeSheet);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`Couldn't find timesheet with id ${fakeTimeSheetId}`);
    expect(response.body.error).toBeTruthy();
  });
});

describe('DELETE /timesheet', () => {
  test('Test of a success delete', async () => {
    const response = await request(app).delete(`/time-sheets/${timeSheetId}`).send();
    expect(response.status).toBe(204);
  });

  test('Test of a failure delete (wrong id)', async () => {
    const response = await request(app).delete(`/time-sheets/${wrongTimeSheetId}`).send();
    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message).toBe(`Invalid id: ${wrongTimeSheetId}`);
  });

  test('Test of a failure delete (wrong id)', async () => {
    const response = await request(app).delete(`/time-sheets/${fakeTimeSheetId}`).send();
    expect(response.status).toBe(404);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message).toBe(`Couldn't find timesheet with id ${fakeTimeSheetId}`);
  });
});

describe('POST /time-sheets', () => {
  test('Should create a time-sheet when all valid data is entered', async () => {
    const response = await request(app).post('/time-sheets').send(mockedTimesheets);

    // eslint-disable-next-line no-underscore-dangle
    idTimesheet = response.body.data._id;

    expect(response.status).toBe(201);
    expect(response.body.error).toBeFalsy();
    expect(response.body.message).toBe('Timesheet created successfully');
  });

  test('Should not create a time-sheet if there is no data received', async () => {
    const response = await request(app).post('/time-sheets').send();

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  test('Should not create a time-sheet if date is empty', async () => {
    mockedTimesheets.date = '';
    const response = await request(app).post('/time-sheets').send(mockedTimesheets);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);

    mockedTimesheets.date = '2022-10-22T00:00:00.000+00:00';
  });

  test('Should not create a time-sheet if task is empty', async () => {
    mockedTimesheets.task = '';
    const response = await request(app).post('/time-sheets').send(mockedTimesheets);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    mockedTimesheets.task = '63531a7c73636855c2aa7f9a';
  });

  test('Should not create a time-sheet if project is empty', async () => {
    mockedTimesheets.project = '';
    const response = await request(app).post('/time-sheets').send(mockedTimesheets);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    mockedTimesheets.project = '63531a7c73636855c2aa7f9a';
  });

  test('Should not create a time-sheet if employee is empty', async () => {
    mockedTimesheets.employee = '';
    const response = await request(app).post('/time-sheets').send(mockedTimesheets);

    expect(response.status).toBe(400);
    mockedTimesheets.employee = '63531a7c73636855c2aa7f9a';
  });
});

describe('GET /time-sheets', () => {
  test('Should return time-sheets successfully', async () => {
    const response = await request(app).get('/time-sheets').send();

    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.message).toBe('Timesheets found');
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  test('Should return 404 status when there are no time-sheets ', async () => {
    await request(app).delete(`/time-sheets/${timeSheetIdSeed}`).send();
    await request(app).delete(`/time-sheets/${idTimesheet}`).send();

    const response = await request(app).get('/time-sheets').send();

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe('Timesheets not found');
  });
});
