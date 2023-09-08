/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import app from '../app';
import Task from '../models/Tasks';
import Taskseed from '../seed/tasks';

beforeAll(async () => {
  await Task.collection.insertMany(Taskseed);
});

const id = '634dee7bb4b4638a321c53f3';
const inexistentId = '63531a7c73636855c2aa7f8c';
const invalidId = 123;
const firstTaskId = Taskseed[0]._id;
const secondTaskId = Taskseed[1]._id;

const newTaskSeed = Taskseed.map((task) => ({
  ...task,
  _id: task._id.toString(),
}));
const mockedTask = {
  type: 'Backend',
};
const mockedTaskModified = {
  type: 'Testing',
};
const mockedTaskInvalid = {
  type: 'Apple',
};

describe('Delete/task', () => {
  test('should return status code 204', async () => {
    const response = await request(app).delete(`/tasks/${firstTaskId}`).send();
    expect(response.status).toBe(204);
  });
  test('should return 400', async () => {
    const response = await request(app).delete(`/tasks/${invalidId}`).send();
    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message).toBe(`Invalid id ${invalidId}`);
  });
  test('should return 404', async () => {
    const response = await request(app).delete(`/tasks/${firstTaskId}`).send();
    expect(response.status).toBe(404);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message).toBe(`Couldn't find task with id ${firstTaskId}`);
  });
});

describe('Put/employees', () => {
  test('should return status code 200', async () => {
    const response = await request(app).put(`/tasks/${secondTaskId}`).send(mockedTaskModified);
    expect(response.status).toBe(200);
    expect(response.body.data.type).toBe('Testing');
    expect(response.body.error).toBeFalsy();
    expect(response.body.message).toBe(`Modified task with id ${secondTaskId}`);
  });
  test('should return status code 400', async () => {
    const response = await request(app).put(`/tasks/${invalidId}`).send(mockedTask);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message).toBe(`Invalid id ${invalidId}`);
  });
  test('should return status code 404', async () => {
    const response = await request(app).put(`/tasks/${inexistentId}`).send(mockedTask);
    expect(response.status).toBe(404);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message).toBe(`Couldn't find task with id ${inexistentId}`);
  });
  test('should return status code 400 validate error', async () => {
    const response = await request(app).put(`/tasks/${secondTaskId}`).send(mockedTaskInvalid);
    expect(response.status).toBe(400);
    expect(response.body.message[0].message).toBe('Type should be Frontend, Backend or Testing');
    expect(response.error).toBeTruthy();
  });
});

describe('GET by id Endpoints', () => {
  test('Should fail to get a task by ID because invalid ID', async () => {
    const response = await request(app).get(`/tasks/${invalidId}`).send();

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe(`Invalid id: ${invalidId}`);
  });
  test('Should fail to get a task by ID because inexistent ID', async () => {
    const response = await request(app).get(`/tasks/${inexistentId}`).send();

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe(`Couldn't find task with id ${inexistentId}`);
  });
  test('Should get a task by ID successfully', async () => {
    const response = await request(app).get(`/tasks/${id}`).send();

    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data).toEqual(newTaskSeed[2]);
    expect(response.body.message).toBe(`Found task with id ${id}`);
  });
});
describe('GET Endpoints', () => {
  test('Should get all tasks', async () => {
    const response = await request(app).get('/tasks/').send();

    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.message).toBe('Tasks found');
  });

  test('Should fail to get tasks', async () => {
    await request(app).delete('/tasks/634dee7bb4b4638a321c53f3').send();
    await request(app).delete('/tasks/634dee7cb4b4638a321c53f5').send();
    await request(app).delete('/tasks/63531a7c73636855c2aa7f9a').send();
    await request(app).delete('/tasks/6357795eb78425a9d8da6849').send();

    const response = await request(app).get('/tasks/').send();

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe('Tasks not found');
  });
});
describe('POST Endpoints', () => {
  test('Should fail to create a task because invalid body', async () => {
    const response = await request(app).post('/tasks/').send({ type: 'Something' });

    expect(response.status).toBe(400);
    expect(response.body.data).toBe(undefined);
    expect(response.body.message[0].message).toBe('Type should be Frontend, Backend or Testing');
    expect(response.body.error).toBeTruthy();
  });
  test('Should fail to create a task because empty body', async () => {
    const response = await request(app).post('/tasks/').send();

    expect(response.status).toBe(400);
    expect(response.body.data).toBe(undefined);
    expect(response.body.message[0].message).toBe('A type is required');
    expect(response.body.error).toBeTruthy();
  });
  test('Should create a task successfully', async () => {
    const response = await request(app).post('/tasks/').send(mockedTask);

    expect(response.status).toBe(201);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data.type).toEqual(mockedTask.type);
    expect(response.body.message).toBe('Task created successfully');
  });
});
