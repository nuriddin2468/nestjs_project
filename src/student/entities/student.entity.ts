import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class Student {
  @Field(() => User, { nullable: false })
  userInfo: User;
}
