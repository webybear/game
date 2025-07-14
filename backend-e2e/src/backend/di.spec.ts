import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@swapi-game/backend/app/app.module';
import { GameResolver } from '@swapi-game/backend/app/resolvers/game.resolver';
import { INestApplication } from '@nestjs/common';

describe('Backend Dependency Injection', () => {
  let app: INestApplication;
  let resolver: GameResolver;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    resolver = app.get<GameResolver>(GameResolver);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should have the GameResolver defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should inject GameService into GameResolver', () => {
    expect((resolver as any).gameService).toBeDefined();
  });
}); 