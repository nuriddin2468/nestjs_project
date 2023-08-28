import { Injectable } from '@nestjs/common';
import { DataLoaders } from './types/dataLoaders';
import { createCompanyDataLoader } from './loaders/school/school.dataloaders';
import { PrismaService } from 'nestjs-prisma';
import {
  createDirectorDataLoader,
  createSchoolsDataLoader,
} from './loaders/company/company.dataloaders';

@Injectable()
export class DataloaderService {
  constructor(private prisma: PrismaService) {}
  createLoaders(): DataLoaders {
    return {
      school: {
        company: createCompanyDataLoader(this.prisma),
      },
      company: {
        director: createDirectorDataLoader(this.prisma),
        schools: createSchoolsDataLoader(this.prisma),
      },
    };
  }
}
