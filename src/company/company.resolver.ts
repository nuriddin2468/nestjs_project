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
import { Role } from '@prisma/client';
import { UpdateCompanyInput } from './dto/update-company.input';
import { CompanyService } from './company.service';
import { PaginationInput } from 'src/common/pagination/pagination.input';
import { School } from 'src/school/entities/school.entity';
import { Roles, RolesGuard } from 'src/common/guards/roles.guard';

@Resolver(() => Company)
@UseGuards(GqlAuthGuard)
export class CompanyResolver {
  constructor(
    private prisma: PrismaService,
    private companyService: CompanyService
  ) {}

  @Mutation(() => Company)
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  createCompany(
    @UserEntity() user: User,
    @Args('data') data: CreateCompanyInput
  ) {
    return this.prisma.company.create({
      data: {
        title: data.title,
        logo: data.logo,
      },
    });
  }

  @Query(() => [Company])
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  fetchCompanies(@UserEntity() user: User) {
    return this.prisma.company.findMany();
  }

  @Query(() => Company)
  @Roles(Role.ADMIN, Role.DIRECTOR)
  @UseGuards(RolesGuard)
  async fetchCompany(
    @UserEntity() user: User,
    @Args('companyId', { type: () => String, nullable: true })
    companyId?: string
  ) {
    if (user.role === Role.ADMIN && !!companyId)
      return this.prisma.company.findUnique({ where: { id: companyId } });
    return this.companyService.fetchUserCompany(user);
  }

  @Mutation(() => Company)
  @Roles(Role.ADMIN, Role.DIRECTOR)
  @UseGuards(RolesGuard)
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
    const company = await this.companyService.fetchUserCompany(user);
    if (!company) throw Error('User do not have any company');
    return this.prisma.company.update({
      where: { id: company.id },
      data: data,
    });
  }

  @Mutation(() => Company)
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async deleteCompany(
    @Args('companyId', { type: () => String, nullable: true })
    companyId: string
  ) {
    return this.prisma.company.delete({
      where: { id: companyId },
    });
  }

  @ResolveField('schools', () => [School])
  @Roles(Role.ADMIN, Role.DIRECTOR)
  @UseGuards(RolesGuard)
  schools(@Parent() company: Company) {
    return this.prisma.school.findMany({
      where: {
        companyId: company.id,
      },
    });
  }

  @ResolveField('users', () => [User])
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  users(
    @Parent() company: Company,
    @Args('pagination') pagination: PaginationInput
  ) {
    return this.prisma.user.findMany({
      cursor: {
        id: pagination.cursor,
      },
      take: pagination.take,
      where: {
        school: {
          company: {
            id: company.id,
          },
        },
      },
    });
  }
}
