import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/shared';
import { mockPrismaService } from '../../setup/mocks';

describe('RoommateControllerController (e2e)', () => {
  let app: INestApplication;
  let prisma: typeof mockPrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.setGlobalPrefix('api/v1');
    await app.init();

    prisma = moduleFixture.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/roommates/create', () => {
    it('should create a roommate successfully', async () => {
      const createDto = {};
      const mockRoommate = {
        id: 'roommate-id-1',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prisma.roommate.create.mockResolvedValue(mockRoommate as any);
      const response = await request(app.getHttpServer())
        .post('/api/v1/roommates/create')
        .send(createDto)
        .expect(201);
      expect(response.body.status).toBe(true);
    });
  });

  describe('GET /api/v1/roommates/list', () => {
    it('should return list of roommates', async () => {
      prisma.roommate.findMany.mockResolvedValue([] as any);
      const response = await request(app.getHttpServer())
        .get('/api/v1/roommates/list')
        .expect(200);
      expect(response.body.status).toBe(true);
    });
  });
});
