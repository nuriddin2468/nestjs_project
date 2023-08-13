import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { School } from 'src/school/entities/school.entity';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class Company extends BaseModel {
  @Field(() => String)
  title: string;

  @Field(() => String)
  logo: string;

  @Field(() => [User])
  users: User[];

  @Field(() => [School])
  schools: School[];
}
