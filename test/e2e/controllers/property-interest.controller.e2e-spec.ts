import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/shared';
import { mockPrismaService } from '../../setup/mocks';

describe('PropertyInterestControllerController (e2e)', () => {
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

  describe('POST /api/v1/property-interests/create', () => {
    it('should create a property-interest successfully', async () => {
      const createDto = {};
      const mockPropertyInterest = {
        id: 'property-interest-id-1',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prisma.propertyInterest.create.mockResolvedValue(mockPropertyInterest as any);
      const response = await request(app.getHttpServer())
        .post('/api/v1/property-interests/create')
        .send(createDto)
        .expect(201);
      expect(response.body.status).toBe(true);
    });
  });

  describe('GET /api/v1/property-interests/list', () => {
    it('should return list of property-interests', async () => {
      prisma.propertyInterest.findMany.mockResolvedValue([] as any);
      const response = await request(app.getHttpServer())
        .get('/api/v1/property-interests/list')
        .expect(200);
      expect(response.body.status).toBe(true);
    });
  });
});
