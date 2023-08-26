import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import {
  School,
  SchoolPaginatedModel,
} from 'src/school/entities/school.entity';
import { User, UserPaginatedModel } from 'src/users/models/user.model';
import Paginated from '../../common/pagination/pagination';

@ObjectType()
export class Company extends BaseModel {
  @Field(() => String)
  title: string;

  @Field(() => String)
  logo: string;

  @Field(() => [School])
  schoolsConnection: SchoolPaginatedModel;

  @Field(() => User, { nullable: true })
  director: User;

  @Field(() => UserPaginatedModel)
  usersConnection: UserPaginatedModel;
}

@ObjectType()
export class CompanyPaginatedModel extends Paginated(Company) {}
