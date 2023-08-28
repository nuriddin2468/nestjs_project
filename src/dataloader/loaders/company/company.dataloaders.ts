import { PrismaService } from 'nestjs-prisma';
import DataLoader from 'dataloader';
import { Role, School, User } from '@prisma/client';
import { PaginationArgs } from '../../../common/pagination/pagination.args';

export const createDirectorDataLoader = (prisma: PrismaService) => {
  return new DataLoader<string, User>((companyIds) => {
    return prisma.user.findMany({
      where: {
        companyId: { in: [...companyIds] },
        role: Role.DIRECTOR,
      },
    });
  });
};

export const createSchoolsDataLoader = (prisma: PrismaService) => {
  return new DataLoader<{ companyId: string; args: PaginationArgs }, School>(
    (data) => {
      return prisma.school.findMany({
        where: {
          companyId: {
            in: data.map((res) => res.companyId),
          },
          ...data[0].args,
        },
      });
    }
  );
};
