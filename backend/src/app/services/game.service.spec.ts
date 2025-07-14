import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { DatabaseConfig } from '../config/database.config';
import { ResourceType } from '../entities/game.entity';

// Mock the DatabaseConfig
const mockDatabaseConfig = {
  peopleTableName: 'test-people',
  starshipsTableName: 'test-starships',
  getRandomItems: jest.fn(),
  putItem: jest.fn(),
  scanTable: jest.fn(),
};

describe('GameService', () => {
  let service: GameService;
  let databaseConfig: DatabaseConfig;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: DatabaseConfig,
          useValue: mockDatabaseConfig,
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
    databaseConfig = module.get<DatabaseConfig>(DatabaseConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRandomPair', () => {
    it('should return a game round with two people and determine winner based on mass', async () => {
      // Mock data
      const mockPeople = [
        { id: '1', name: 'Luke Skywalker', mass: 77, height: '172', gender: 'male', homeworld: 'Tatooine' },
        { id: '2', name: 'Darth Vader', mass: 136, height: '202', gender: 'male', homeworld: 'Tatooine' },
      ];

      mockDatabaseConfig.getRandomItems.mockResolvedValue(mockPeople);

      const result = await service.getRandomPair(ResourceType.PEOPLE);

      expect(result).toBeDefined();
      expect(result.entities).toHaveLength(2);
      expect(result.resourceType).toBe(ResourceType.PEOPLE);
      expect(result.winningAttribute).toBe('mass');
      expect(result.winner).toBeDefined();
      expect(result.winner?.name).toBe('Darth Vader'); // Higher mass wins
    });

    it('should return a game round with two starships and determine winner based on crew', async () => {
      // Mock data
      const mockStarships = [
        { id: '1', name: 'X-wing', crew: 1, model: 'T-65 X-wing', manufacturer: 'Incom Corporation', passengers: '0' },
        { id: '2', name: 'Death Star', crew: 342953, model: 'DS-1 Orbital Battle Station', manufacturer: 'Imperial Department of Military Research', passengers: '843342' },
      ];

      mockDatabaseConfig.getRandomItems.mockResolvedValue(mockStarships);

      const result = await service.getRandomPair(ResourceType.STARSHIPS);

      expect(result).toBeDefined();
      expect(result.entities).toHaveLength(2);
      expect(result.resourceType).toBe(ResourceType.STARSHIPS);
      expect(result.winningAttribute).toBe('crew');
      expect(result.winner).toBeDefined();
      expect(result.winner?.name).toBe('Death Star'); // Higher crew wins
    });

    it('should handle tie by returning first entity', async () => {
      // Mock data with same mass
      const mockPeople = [
        { id: '1', name: 'Luke Skywalker', mass: 77, height: '172', gender: 'male', homeworld: 'Tatooine' },
        { id: '2', name: 'Obi-Wan Kenobi', mass: 77, height: '182', gender: 'male', homeworld: 'Stewjon' },
      ];

      mockDatabaseConfig.getRandomItems.mockResolvedValue(mockPeople);

      const result = await service.getRandomPair(ResourceType.PEOPLE);

      expect(result).toBeDefined();
      expect(result.winner?.name).toBe('Luke Skywalker'); // First entity in case of tie
    });

    it('should throw error for invalid resource type', async () => {
      await expect(service.getRandomPair('INVALID' as ResourceType)).rejects.toThrow();
    });
  });

  describe('getGameStats', () => {
    it('should return correct stats', async () => {
      mockDatabaseConfig.scanTable
        .mockResolvedValueOnce({ count: 5 }) // people count
        .mockResolvedValueOnce({ count: 3 }); // starships count

      const result = await service.getGameStats();

      expect(result).toEqual({
        peopleCount: 5,
        starshipsCount: 3,
      });
    });
  });
}); 