import Paginated from 'src/common/pagination/pagination';
import { Company } from './company.model';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CompanyPaginatedModel extends Paginated(Company) {}
