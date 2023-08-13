import { ObjectType, Field, Int, ID, HideField } from '@nestjs/graphql';
import { Company } from 'src/company/models/company.model';

@ObjectType()
export class School {
  @Field(() => ID)
  id: string;

  @Field(() => Company)
  company: Company;

  @Field(() => String)
  title: string;
}
