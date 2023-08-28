/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { User } from 'src/users/models/user.model';
import { CreateCompanyInput } from './dto/create-company.input';
import { Args } from '@nestjs/graphql';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { Role } from '@prisma/client';
import { UpdateCompanyInput } from './dto/update-company.input';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  findDirector(companyId: string) {
    return this.prisma.user.findFirst({
      where: {
        companyId,
        role: Role.DIRECTOR,
      },
    });
  }

  findUsers(companyId: string, pagination: PaginationArgs) {
    return findManyCursorConnection(
      (args) =>
        this.prisma.user.findMany({
          where: {
            companyId,
          },
          ...args,
        }),
      () =>
        this.prisma.user.count({
          where: {
            companyId,
          },
        }),
      pagination
    );
  }

  findSchools(companyId: string, pagination: PaginationArgs) {
    return findManyCursorConnection(
      (args) =>
        this.prisma.school.findMany({
          where: {
            companyId,
          },
          ...args,
        }),
      () =>
        this.prisma.school.count({
          where: {
            companyId,
          },
        }),
      pagination
    );
  }

  updateOne(user: User, data: UpdateCompanyInput, companyId?: string) {
    if (user.role === Role.ADMIN && !!companyId) {
      return this.updateCompanyForAdmin(data, companyId);
    }
    return this.updateOwnCompany(user, data);
  }

  createOne(data: CreateCompanyInput) {
    return this.prisma.company.create({
      data: {
        title: data.title,
        logo: data.logo,
      },
    });
  }

  fetchCompanies(@Args() pagination: PaginationArgs, query: string) {
    return findManyCursorConnection(
      (args) =>
        this.prisma.company.findMany({
          where: {
            title: { contains: query || '' },
          },
          ...args,
        }),
      () =>
        this.prisma.company.count({
          where: {
            title: { contains: query || '' },
          },
        }),
      pagination
    );
  }

  fetchCompany(user: User, companyId?: string) {
    if (user.role === Role.ADMIN && !!companyId)
      return this.fetchCompanyForAdmin(companyId);
    this.fetchOwnCompany(user);
  }

  private fetchCompanyForAdmin(id: string) {
    return this.prisma.company.findUnique({ where: { id } });
  }

  private fetchOwnCompany(user: User) {
    return this.prisma.company.findUniqueOrThrow({
      where: { id: user.companyId },
    });
  }

  private updateCompanyForAdmin(data: UpdateCompanyInput, companyId: string) {
    return this.prisma.company.update({
      where: { id: companyId },
      data: data,
    });
  }

  private updateOwnCompany(user: User, data: UpdateCompanyInput) {
    return this.prisma.company.update({
      where: { id: user.companyId },
      data: data,
    });
  }
}
