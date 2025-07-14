import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Person {
  @Field(() => ID)
  id = '';

  @Field(() => String)
  name = '';

  @Field(() => Int)
  mass = 0;

  @Field({ nullable: true })
  height?: string;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  homeworld?: string;

  constructor(data?: Partial<Person>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  /**
   * Get the competitive attribute for this entity type
   */
  getCompetitiveValue(): number {
    return this.mass;
  }

  /**
   * Get the name of the competitive attribute
   */
  getCompetitiveAttributeName(): string {
    return 'mass';
  }
} 