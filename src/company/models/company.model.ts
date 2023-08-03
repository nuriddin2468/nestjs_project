import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';
import { BaseModel } from 'src/common/models/base.model';

@ObjectType()
export class Company extends BaseModel {
  @Field(() => String)
  title: string;

  @Field(() => String)
  logo: string;

  @Field(() => [User])
  users: [User];
}
