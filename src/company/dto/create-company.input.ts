import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCompanyInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field()
  logo: string;

  @Field(() => [String], { nullable: true })
  userIds: string[];
}
