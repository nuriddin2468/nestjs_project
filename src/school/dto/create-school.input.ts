import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSchoolInput {
  @Field(() => String)
  title: string;
}
