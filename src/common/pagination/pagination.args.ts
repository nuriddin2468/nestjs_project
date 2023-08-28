import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @Min(1)
  skip?: number;

  @Field(() => String, { nullable: true })
  after?: string;

  @Field(() => String, { nullable: true })
  before?: string;

  @Field(() => Int, { nullable: true })
  @Min(1)
  @Max(50)
  first?: number;

  @Field(() => Int, { nullable: true })
  @Min(1)
  @Max(50)
  last?: number;
}
