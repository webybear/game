import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Person } from '../entities/person.entity';
import { Starship } from '../entities/starship.entity';

@ObjectType()
export class PeopleConnection {
  @Field(() => [Person])
  items: Person[] = [];

  @Field({ nullable: true })
  nextToken?: string;

  @Field(() => Int, { nullable: true })
  totalCount?: number;
}

@ObjectType()
export class StarshipConnection {
  @Field(() => [Starship])
  items: Starship[] = [];

  @Field({ nullable: true })
  nextToken?: string;

  @Field(() => Int, { nullable: true })
  totalCount?: number;
} 