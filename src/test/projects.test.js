import request from 'supertest';
import app from '../app';
import Project from '../models/Projects';
import projectSeed from '../seed/projects';

beforeAll(async () => {
  await Project.collection.insertMany(projectSeed);
});

const projectId = '63531aaa2b654a3fb77054dd';
let newIdProject;
const mockedProject = {
  name: 'Eric',
  description: 'asdsadsaddssa',
  startDate: '11-10-2024',
  endDate: '07-12-2024',
  active: true,
  clientName: 'Martins',
  teamMembers: [
    {
      employee: '63531244ec6456efd12685ef',
      role: 'DEV',
      rate: 100,
    },
  ],
};

describe('GET BYID /project/:id', () => {
  test('Should return status code 200', async () => {
    const response = await request(app).get(`/projects/${projectId}`).send();
    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBe(`Found project with id ${projectId}`);
  });
  test('Should return status code 400', async () => {
    const response = await request(app).get('/projects/568').send();
    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message).toBe('Invalid id: 568');
  });
  test('Should return status code 404', async () => {
    const response = await request(app).get(`/projects/${mockedProject.teamMembers[0].employee}`).send();
    expect(response.status).toBe(404);
    expect(response.body.error).toBeTruthy();
  });
});

describe('PUT /project/:id', () => {
  test('everything correct: return status code 200', async () => {
    const res = await request(app).put(`/projects/${projectId}`).send(mockedProject);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe(`Modified project with id ${projectId}`);
    expect(res.body.error).toBeFalsy();
  });
  test('validations: return status code 400', async () => {
    mockedProject.name = '';
    const res = await request(app).put(`/projects/${projectId}`).send(mockedProject);
    expect(res.status).toBe(400);
    expect(res.body.message[0].message).toBe('Name required');
    expect(res.body.error).toBeTruthy();
  });
  test('invalid id: return status code 400', async () => {
    mockedProject.name = 'Eric';
    const res = await request(app).put('/projects/69').send(mockedProject);
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });
  test('id does not exist: return status code 404', async () => {
    const res = await request(app).put(`/projects/${mockedProject.teamMembers[0].employee}`).send(mockedProject);
    expect(res.status).toBe(404);
    expect(res.body.error).toBeTruthy();
  });
});

describe('DELETE /project/:id', () => {
  test('everything correct: return status code 204', async () => {
    const res = await request(app).delete(`/projects/${projectId}`);
    expect(res.status).toBe(204);
    expect(res.body.error).toBeFalsy();
  });
  test('invalid id: return status code 400', async () => {
    const res = await request(app).delete('/projects/42');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid id 42.');
    expect(res.body.error).toBeTruthy();
  });
  test('id does not exist: return status code 404', async () => {
    const res = await request(app).delete(`/projects/${mockedProject.teamMembers[0].employee}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBeTruthy();
  });
});

describe('POST /project', () => {
  test('Should create an project', async () => {
    const response = await request(app).post('/projects').send(mockedProject);
    // eslint-disable-next-line no-underscore-dangle
    newIdProject = response.body.data._id;
    expect(response.status).toBe(201);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBe('Project created successfully');
  });
  test('Should not create an project', async () => {
    const response = await request(app).post('/projects').send();
    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
    expect(response.body.data).toBeUndefined();
    expect(response.body.message[0].message).toBe('Name required');
  });
});

describe('GET /project', () => {
  test('Should return status code 200', async () => {
    const response = await request(app).get('/projects').send();
    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBe('Projects found');
  });
  test('Should return status code 404', async () => {
    await request(app).delete(`/projects/${newIdProject}`);
    const response = await request(app).get('/projects/').send();
    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message).toBe('Projects not found');
  });
});
