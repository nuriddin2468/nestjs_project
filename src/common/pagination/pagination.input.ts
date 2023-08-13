import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsPositive } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field(() => String, { nullable: true })
  cursor?: string;

  @Field(() => Int, { defaultValue: 10 })
  @IsPositive()
  take: number;
}
