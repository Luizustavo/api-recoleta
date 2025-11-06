import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '@/app.module'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    await app.close()
  })

  it('/health (GET) - should return health status', () => {
    return request(app.getHttpServer()).get('/health').expect(200)
  })

  describe('Authentication', () => {
    it('/auth/login (POST) - should return 400 when credentials are missing', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400)
    })

    it('/auth/login (POST) - should return 401 when credentials are invalid', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'invalid@example.com',
          password: 'wrongpassword',
        })
        .expect(401)
    })
  })
})
