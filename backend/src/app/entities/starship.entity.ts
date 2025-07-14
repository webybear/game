import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Starship {
  @Field(() => ID)
  id = '';

  @Field(() => String)
  name = '';

  @Field(() => Int)
  crew = 0;

  @Field({ nullable: true })
  model?: string;

  @Field({ nullable: true })
  manufacturer?: string;

  @Field({ nullable: true })
  passengers?: string;

  constructor(data?: Partial<Starship>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  /**
   * Get the competitive attribute for this entity type
   */
  getCompetitiveValue(): number {
    return this.crew;
  }

  /**
   * Get the name of the competitive attribute
   */
  getCompetitiveAttributeName(): string {
    return 'crew';
  }
} 