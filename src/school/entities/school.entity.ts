import { ObjectType, Field, Int, ID, HideField } from '@nestjs/graphql';
import { Company } from 'src/company/models/company.model';
import Paginated from '../../common/pagination/pagination';

@ObjectType()
export class School {
  @Field(() => ID)
  id: string;

  @Field(() => Company)
  company: Company;

  @Field(() => String)
  companyId: string;

  @Field(() => String)
  title: string;
}

@ObjectType()
export class SchoolPaginatedModel extends Paginated(School) {}
