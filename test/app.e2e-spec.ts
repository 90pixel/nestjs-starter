import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(new FastifyAdapter());
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    app.getHttpAdapter().getInstance().ready();
  });

  it('api document', async () => {
    const apiRequest = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'username',
        password: 'test12345',
      });
    expect(apiRequest.status).toBe(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
