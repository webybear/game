import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseConfig } from '../config/database.config';
import { Person } from '../entities/person.entity';
import { Starship } from '../entities/starship.entity';
import { GameRound, ResourceType } from '../entities/game.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GameService {
  constructor(private readonly databaseConfig: DatabaseConfig) {}

  /**
   * Core game logic: Get two random entities and determine the winner
   */
  async getRandomPair(resourceType: ResourceType): Promise<GameRound> {
    try {
      let entities: (Person | Starship)[] = [];
      let winner: Person | Starship | undefined;
      let winningAttribute: string;

      if (resourceType === ResourceType.PEOPLE) {
        // Get random people
        const randomData = await this.databaseConfig.getRandomItems(
          this.databaseConfig.peopleTableName,
          2
        );
        
        entities = randomData.map(data => new Person(data));
        winningAttribute = 'mass';
        
        // Determine winner based on mass
        winner = this.determineWinner(entities as Person[], 'getCompetitiveValue');
        
      } else if (resourceType === ResourceType.STARSHIPS) {
        // Get random starships
        const randomData = await this.databaseConfig.getRandomItems(
          this.databaseConfig.starshipsTableName,
          2
        );
        
        entities = randomData.map(data => new Starship(data));
        winningAttribute = 'crew';
        
        // Determine winner based on crew
        winner = this.determineWinner(entities as Starship[], 'getCompetitiveValue');
      } else {
        throw new BadRequestException('Invalid resource type. Must be PEOPLE or STARSHIPS.');
      }

      return new GameRound({
        entities,
        winner,
        winningAttribute,
        resourceType,
      });
    } catch (error) {
      console.error('Error in getRandomPair:', error);
      throw error;
    }
  }

  /**
   * Determine the winner between two entities based on their competitive value
   */
  private determineWinner<T extends Person | Starship>(
    entities: T[],
    valueMethod: 'getCompetitiveValue'
  ): T | undefined {
    if (entities.length !== 2) {
      throw new Error('Exactly 2 entities are required to determine a winner');
    }

    const [entity1, entity2] = entities;
    const value1 = entity1[valueMethod]();
    const value2 = entity2[valueMethod]();

    // Higher value wins
    if (value1 > value2) {
      return entity1;
    } else if (value2 > value1) {
      return entity2;
    } else {
      // It's a tie - could return null or first entity
      return entity1; // Return first entity in case of tie
    }
  }

  /**
   * Seed the database with initial Star Wars data
   */
  async seedDatabase(): Promise<void> {
    try {
      // Seed people data
      const samplePeople = [
        {
          id: uuidv4(),
          name: 'Luke Skywalker',
          mass: 77,
          height: '172',
          gender: 'male',
          homeworld: 'Tatooine',
        },
        {
          id: uuidv4(),
          name: 'Darth Vader',
          mass: 136,
          height: '202',
          gender: 'male',
          homeworld: 'Tatooine',
        },
        {
          id: uuidv4(),
          name: 'Leia Organa',
          mass: 49,
          height: '150',
          gender: 'female',
          homeworld: 'Alderaan',
        },
        {
          id: uuidv4(),
          name: 'Obi-Wan Kenobi',
          mass: 77,
          height: '182',
          gender: 'male',
          homeworld: 'Stewjon',
        },
        {
          id: uuidv4(),
          name: 'Yoda',
          mass: 17,
          height: '66',
          gender: 'male',
          homeworld: 'Dagobah',
        },
      ];

      // Seed starships data
      const sampleStarships = [
        {
          id: uuidv4(),
          name: 'Millennium Falcon',
          crew: 4,
          model: 'YT-1300 light freighter',
          manufacturer: 'Corellian Engineering Corporation',
          passengers: '6',
        },
        {
          id: uuidv4(),
          name: 'X-wing',
          crew: 1,
          model: 'T-65 X-wing',
          manufacturer: 'Incom Corporation',
          passengers: '0',
        },
        {
          id: uuidv4(),
          name: 'Imperial Star Destroyer',
          crew: 47060,
          model: 'Imperial I-class Star Destroyer',
          manufacturer: 'Kuat Drive Yards',
          passengers: '0',
        },
        {
          id: uuidv4(),
          name: 'Death Star',
          crew: 342953,
          model: 'DS-1 Orbital Battle Station',
          manufacturer: 'Imperial Department of Military Research',
          passengers: '843342',
        },
        {
          id: uuidv4(),
          name: 'TIE Fighter',
          crew: 1,
          model: 'Twin Ion Engine Fighter',
          manufacturer: 'Sienar Fleet Systems',
          passengers: '0',
        },
      ];

      // Insert people
      for (const person of samplePeople) {
        await this.databaseConfig.putItem(
          this.databaseConfig.peopleTableName,
          person
        );
      }

      // Insert starships
      for (const starship of sampleStarships) {
        await this.databaseConfig.putItem(
          this.databaseConfig.starshipsTableName,
          starship
        );
      }

      console.log('Database seeded successfully with sample Star Wars data!');
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    }
  }

  /**
   * Get statistics about the game data
   */
  async getGameStats(): Promise<{
    peopleCount: number;
    starshipsCount: number;
  }> {
    try {
      const peopleResult = await this.databaseConfig.scanTable(
        this.databaseConfig.peopleTableName
      );
      const starshipsResult = await this.databaseConfig.scanTable(
        this.databaseConfig.starshipsTableName
      );

      return {
        peopleCount: peopleResult.count,
        starshipsCount: starshipsResult.count,
      };
    } catch (error) {
      console.error('Error getting game stats:', error);
      throw error;
    }
  }
} 