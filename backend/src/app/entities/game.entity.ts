import { ObjectType, Field, createUnionType, registerEnumType } from '@nestjs/graphql';
import { Person } from './person.entity';
import { Starship } from './starship.entity';

// Create the union type for game entities
export const GameEntity = createUnionType({
  name: 'GameEntity',
  types: () => [Person, Starship] as const,
  resolveType(value) {
    if ('mass' in value) {
      return Person;
    }
    if ('crew' in value) {
      return Starship;
    }
    return null;
  },
});

// Enum for resource types
export enum ResourceType {
  PEOPLE = 'PEOPLE',
  STARSHIPS = 'STARSHIPS',
}

registerEnumType(ResourceType, {
  name: 'ResourceType',
});

@ObjectType()
export class GameRound {
  @Field(() => [GameEntity])
  entities: (Person | Starship)[] = [];

  @Field(() => GameEntity, { nullable: true })
  winner?: Person | Starship;

  @Field({ nullable: true })
  winningAttribute?: string;

  @Field(() => ResourceType)
  resourceType: ResourceType = ResourceType.PEOPLE;

  constructor(data?: Partial<GameRound>) {
    if (data) {
      Object.assign(this, data);
      if (data.resourceType) {
        const typename =
          data.resourceType === ResourceType.PEOPLE ? 'Person' : 'Starship';

        if (this.winner) {
          (this.winner as any).__typename = typename;
        }
        if (this.entities) {
          this.entities.forEach((entity) => {
            (entity as any).__typename = typename;
          });
        }
      }
    }
  }
}

@ObjectType()
export class GameStats {
  @Field()
  peopleCount: number;

  @Field()
  starshipsCount: number;

  constructor(peopleCount: number, starshipsCount: number) {
    this.peopleCount = peopleCount;
    this.starshipsCount = starshipsCount;
  }
} 