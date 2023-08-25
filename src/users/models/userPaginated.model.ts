import Paginated from 'src/common/pagination/pagination';
import { ObjectType } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType()
export class UserPaginatedModel extends Paginated(User) {}
