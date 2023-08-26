import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';
import Paginated from '../../common/pagination/pagination';

@ObjectType()
export class Student {
  @Field(() => User, { nullable: false })
  userInfo: User;
}

@ObjectType()
export class StudentPaginatedModel extends Paginated(Student) {}
