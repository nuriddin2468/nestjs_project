import Paginated from 'src/common/pagination/pagination';
import { ObjectType } from '@nestjs/graphql';
import { School } from './school.entity';

@ObjectType()
export class SchoolPaginatedModel extends Paginated(School) {}
