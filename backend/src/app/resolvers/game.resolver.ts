import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { GameService } from '../services/game.service';
import { PeopleService } from '../services/people.service';
import { StarshipsService } from '../services/starships.service';
import { GameRound, ResourceType, GameStats, GameEntity } from '../entities/game.entity';
import { Person } from '../entities/person.entity';
import { Starship } from '../entities/starship.entity';
import { CreatePersonInput, UpdatePersonInput } from '../dto/create-person.dto';
import { CreateStarshipInput, UpdateStarshipInput } from '../dto/create-starship.dto';
import { PeopleConnection, StarshipConnection } from '../dto/connection.dto';

@Resolver(() => GameEntity)
export class GameEntityResolver {
  __resolveType(value: Person | Starship) {
    if ('mass' in value) {
      return Person;
    }
    return Starship;
  }
}

@Resolver()
export class GameResolver {
  constructor(
    private readonly gameService: GameService,
    private readonly peopleService: PeopleService,
    private readonly starshipsService: StarshipsService,
  ) {}

  // ============================================
  // Game Queries
  // ============================================

  @Query(() => GameRound, { name: 'getRandomPair' })
  async getRandomPair(
    @Args('resource', { type: () => ResourceType }) resource: ResourceType,
  ): Promise<GameRound> {
    return this.gameService.getRandomPair(resource);
  }

  // ============================================
  // Person Queries
  // ============================================

  @Query(() => Person, { name: 'getPerson', nullable: true })
  async getPerson(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Person | null> {
    return this.peopleService.getPerson(id);
  }

  @Query(() => PeopleConnection, { name: 'listPeople' })
  async listPeople(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('nextToken', { nullable: true }) nextToken?: string,
  ): Promise<PeopleConnection> {
    return this.peopleService.listPeople(limit, nextToken);
  }

  // ============================================
  // Starship Queries
  // ============================================

  @Query(() => Starship, { name: 'getStarship', nullable: true })
  async getStarship(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Starship | null> {
    return this.starshipsService.getStarship(id);
  }

  @Query(() => StarshipConnection, { name: 'listStarships' })
  async listStarships(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('nextToken', { nullable: true }) nextToken?: string,
  ): Promise<StarshipConnection> {
    return this.starshipsService.listStarships(limit, nextToken);
  }

  // ============================================
  // Person Mutations
  // ============================================

  @Mutation(() => Person, { name: 'createPerson' })
  async createPerson(
    @Args('input') input: CreatePersonInput,
  ): Promise<Person> {
    return this.peopleService.createPerson(input);
  }

  @Mutation(() => Person, { name: 'updatePerson' })
  async updatePerson(
    @Args('input') input: UpdatePersonInput,
  ): Promise<Person> {
    return this.peopleService.updatePerson(input);
  }

  @Mutation(() => ID, { name: 'deletePerson' })
  async deletePerson(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<string> {
    return this.peopleService.deletePerson(id);
  }

  // ============================================
  // Starship Mutations
  // ============================================

  @Mutation(() => Starship, { name: 'createStarship' })
  async createStarship(
    @Args('input') input: CreateStarshipInput,
  ): Promise<Starship> {
    return this.starshipsService.createStarship(input);
  }

  @Mutation(() => Starship, { name: 'updateStarship' })
  async updateStarship(
    @Args('input') input: UpdateStarshipInput,
  ): Promise<Starship> {
    return this.starshipsService.updateStarship(input);
  }

  @Mutation(() => ID, { name: 'deleteStarship' })
  async deleteStarship(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<string> {
    return this.starshipsService.deleteStarship(id);
  }

  // ============================================
  // Admin/Utility Mutations (for development)
  // ============================================

  @Mutation(() => String, { name: 'seedDatabase' })
  async seedDatabase(): Promise<string> {
    await this.gameService.seedDatabase();
    return 'Database seeded successfully!';
  }

  @Query(() => GameStats, { name: 'gameStats' })
  async gameStats(): Promise<GameStats> {
    return this.gameService.getGameStats();
  }
} 