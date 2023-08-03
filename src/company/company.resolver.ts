import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Company } from './models/company.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UserEntity } from '../common/decorators/user.decorator';
import { User } from '../users/models/user.model';
import { CreateCompanyInput } from './dto/create-company.input';
import { PrismaService } from 'nestjs-prisma';
import { AdminGuard } from '../auth/admin.guard';
import { Role } from '@prisma/client';
import { UpdateCompanyInput } from './dto/update-company.input';
import { UserService } from '../common/services/user/user.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Company)
export class CompanyResolver {
  constructor(
    private prisma: PrismaService,
    private userService: UserService
  ) {}

  @UseGuards(AdminGuard)
  @Mutation(() => Company)
  createCompany(
    @UserEntity() user: User,
    @Args('data') data: CreateCompanyInput
  ) {
    return this.prisma.company.create({
      data: {
        title: data.title,
        logo: data.logo,
        users: { connect: data.userIds.map((res) => ({ id: res })) },
      },
    });
  }

  @UseGuards(AdminGuard)
  @Query(() => [Company])
  fetchCompanies() {
    return this.prisma.company.findMany();
  }

  @Query(() => Company)
  fetchCompany(
    @UserEntity() user: User,
    @Args('companyId', { type: () => String, nullable: true })
    companyId?: string
  ) {
    if (user.role === Role.ADMIN && !!companyId)
      return this.prisma.company.findUnique({ where: { id: companyId } });
    if (!user.companyId) throw Error('User has no related company');
    return this.prisma.company.findUnique({ where: { id: user.companyId } });
  }

  @Mutation(() => Company)
  async updateCompany(
    @UserEntity() user: User,
    @Args('data') data: UpdateCompanyInput,
    @Args('companyId', { type: () => String, nullable: true })
    companyId?: string
  ) {
    if (user.role === Role.ADMIN && !!companyId) {
      return this.prisma.company.update({
        where: { id: companyId },
        data: data,
      });
    }
    if (!user.companyId) throw Error('User has no related company');
    await this.userService.isCompanyOwner(user, user.companyId);
    return this.prisma.company.update({
      where: { id: user.companyId },
      data: data,
    });
  }

  @UseGuards(AdminGuard)
  @ResolveField('users', () => [User])
  users(@Parent() company: Company) {
    return this.prisma.company
      .findUnique({ where: { id: company.id } })
      .users();
  }
}
