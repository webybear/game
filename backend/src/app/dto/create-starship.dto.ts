import { InputType, Field, Int, ID } from '@nestjs/graphql';

@InputType()
export class CreateStarshipInput {
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
}

@InputType()
export class UpdateStarshipInput {
  @Field(() => ID)
  id = '';

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  crew?: number;

  @Field({ nullable: true })
  model?: string;

  @Field({ nullable: true })
  manufacturer?: string;

  @Field({ nullable: true })
  passengers?: string;
} 