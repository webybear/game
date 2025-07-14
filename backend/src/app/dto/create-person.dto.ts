import { InputType, Field, Int, ID } from '@nestjs/graphql';

@InputType()
export class CreatePersonInput {
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
}

@InputType()
export class UpdatePersonInput {
  @Field(() => ID)
  id = '';

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  mass?: number;

  @Field({ nullable: true })
  height?: string;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  homeworld?: string;
} 