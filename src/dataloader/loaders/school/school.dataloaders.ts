import { PrismaService } from 'nestjs-prisma';
import DataLoader from 'dataloader';
import { Company } from '@prisma/client';

export const createCompanyDataLoader = (prisma: PrismaService) => {
  return new DataLoader<string, Company>((ids) => {
    return prisma.company.findMany({
      where: {
        id: { in: [...ids] },
      },
    });
  });
};
