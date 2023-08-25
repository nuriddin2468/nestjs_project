import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Role, User } from '@prisma/client';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { CreateSchoolInput } from './dto/create-school.input';

@Injectable()
export class SchoolService {
  constructor(private prisma: PrismaService) {}

  findOne(user: User, id: string) {
    return user.role === 'ADMIN'
      ? this.findForAdmin(id)
      : this.findForOthers(user, id);
  }

  createOne(user: User, data: CreateSchoolInput, companyId: string) {
    if (user.role === Role.ADMIN && !companyId)
      throw Error('You need to declare Company Id');
    if (user.role === Role.ADMIN && companyId) {
      return this.createOneForAdmin(data, companyId);
    }
    return this.createOneForDirector(user, data);
  }

  findAll(user: User, pagination: PaginationArgs) {
    if (user.role === Role.ADMIN) {
      return this.findAllForAdmins(pagination);
    }

    return this.findAllForDirector(user, pagination);
  }

  private findAllForDirector(user: User, pagination: PaginationArgs) {
    return findManyCursorConnection(
      (args) =>
        this.prisma.school.findMany({
          ...args,
          where: {
            companyId: user.companyId,
          },
        }),
      () =>
        this.prisma.school.count({
          where: {
            companyId: user.companyId,
          },
        }),
      pagination
    );
  }

  private createOneForAdmin(data: CreateSchoolInput, companyId: string) {
    return this.prisma.school.create({
      data: {
        title: data.title,
        company: {
          connect: {
            id: companyId,
          },
        },
      },
    });
  }

  private createOneForDirector(user: User, data: CreateSchoolInput) {
    return this.prisma.school.create({
      data: {
        title: data.title,
        company: {
          connect: {
            id: user.companyId,
          },
        },
      },
    });
  }

  private findForAdmin(id: string) {
    return this.prisma.school.findUniqueOrThrow({ where: { id } });
  }

  private findForOthers(user: User, id: string) {
    return this.prisma.school.findFirst({
      where: {
        id,
        users: {
          some: {
            id: user.id,
          },
        },
      },
    });
  }

  private findAllForAdmins(pagination: PaginationArgs) {
    return findManyCursorConnection(
      (args) =>
        this.prisma.school.findMany({
          ...args,
        }),
      () => this.prisma.school.count(),
      pagination
    );
  }
}
