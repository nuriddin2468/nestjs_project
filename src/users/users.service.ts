import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PasswordService } from 'src/auth/password.service';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Company, Role } from '@prisma/client';
import { User } from './models/user.model';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { PaginationArgs } from '../common/pagination/pagination.args';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService
  ) {}

  update(userId: string, newUserData: UpdateUserInput) {
    return this.prisma.user.update({
      data: newUserData,
      where: {
        id: userId,
      },
    });
  }

  findAll(pagination: PaginationArgs) {
    return findManyCursorConnection(
      (args) => this.prisma.user.findMany({ ...args }),
      () => this.prisma.user.count(),
      pagination
    );
  }

  async getUserCompany(userId: string): Promise<Company | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        school: {
          include: {
            company: true,
          },
        },
      },
    });
    return userData?.school?.company || null;
  }

  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword
    );

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }
}
