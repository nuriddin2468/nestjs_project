import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Role } from '@prisma/client';
import { CreateStudentInput } from './dto/create-student.input';
import { PrismaService } from 'nestjs-prisma';
import { User } from '../users/models/user.model';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { PaginationArgs } from '../common/pagination/pagination.args';

@Injectable()
export class StudentService {
  constructor(private auth: AuthService, private prisma: PrismaService) {}

  findAll(user: User, pagination: PaginationArgs) {
    if (user.role === Role.ADMIN) {
      return this.findAllForAdmin(pagination);
    }
    return this.findAllForOthers(user, pagination);
  }

  createOne(user: User, data: CreateStudentInput, companyId?: string) {
    if (user.role === Role.ADMIN && companyId) {
      return this.createOneForAdmin(data, companyId);
    }
    return this.createOneForCompany(user, data);
  }

  private createOneForAdmin(data: CreateStudentInput, companyId: string) {
    return this.auth.createUser(data, Role.STUDENT, companyId);
  }

  private createOneForCompany(user: User, data: CreateStudentInput) {
    return this.auth.createUser(data, Role.STUDENT, user.companyId);
  }

  private findAllForOthers(user: User, pagination: PaginationArgs) {
    return findManyCursorConnection(
      (args) =>
        this.prisma.student.findMany({
          where: {
            user: {
              companyId: user.companyId,
            },
          },
          ...args,
        }),
      () =>
        this.prisma.student.count({
          where: {
            user: {
              companyId: user.companyId,
            },
          },
        }),
      pagination
    );
  }

  private findAllForAdmin(pagination: PaginationArgs) {
    return findManyCursorConnection(
      (args) => this.prisma.student.findMany({ ...args }),
      () => this.prisma.student.count(),
      pagination
    );
  }
}
