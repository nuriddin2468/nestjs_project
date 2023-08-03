import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateCompanyInput {
  @Field(() => String)
  @IsOptional()
  title?: string;

  @Field(() => String)
  @IsOptional()
  logo?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  addUserIds?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  removeUserIds?: string[];
}
