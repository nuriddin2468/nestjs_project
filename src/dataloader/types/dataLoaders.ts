import DataLoader from 'dataloader';
import { Company, School, User } from '@prisma/client';
import { PaginationArgs } from '../../common/pagination/pagination.args';

export interface DataLoaders {
  school: {
    company: DataLoader<string, Company>;
  };
  company: {
    director: DataLoader<string, User>;
    schools: DataLoader<{ companyId: string; args: PaginationArgs }, School>;
  };
}
