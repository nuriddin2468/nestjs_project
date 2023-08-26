import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Company, CompanyPaginatedModel } from './models/company.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UserEntity } from '../common/decorators/user.decorator';
import { User, UserPaginatedModel } from '../users/models/user.model';
import { CreateCompanyInput } from './dto/create-company.input';
import { PrismaService } from 'nestjs-prisma';
import { Role } from '@prisma/client';
import { UpdateCompanyInput } from './dto/update-company.input';
import { CompanyService } from './company.service';
import { Roles, RolesGuard } from 'src/common/guards/roles.guard';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { SchoolPaginatedModel } from "../school/entities/school.entity";

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
  createCompany(@Args('data') data: CreateCompanyInput) {
    return this.companyService.createOne(data);
  }

  @Query(() => CompanyPaginatedModel)
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async companiesConnection(
    @Args() pagination: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true })
    query: string
  ) {
    return this.companyService.fetchCompanies(pagination, query);
  }

  @Query(() => Company)
  @Roles(Role.ADMIN, Role.DIRECTOR)
  @UseGuards(RolesGuard)
  company(
    @UserEntity() user: User,
    @Args('companyId', { type: () => String, nullable: true })
    companyId?: string
  ) {
    this.companyService.fetchCompany(user, companyId);
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
    return this.companyService.updateOne(user, data, companyId);
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

  @ResolveField('schoolsConnection', () => SchoolPaginatedModel)
  @Roles(Role.ADMIN, Role.DIRECTOR)
  @UseGuards(RolesGuard)
  schoolsConnection(
    @Parent() company: Company,
    @Args() pagination: PaginationArgs
  ) {
    return this.companyService.findSchools(company.id, pagination);
  }

  @ResolveField('usersConnection', () => UserPaginatedModel)
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  usersConnection(
    @Parent() company: Company,
    @Args() pagination: PaginationArgs
  ) {
    return this.companyService.findUsers(company.id, pagination);
  }

  @ResolveField('director', () => User)
  @Roles(Role.ADMIN, Role.DIRECTOR)
  @UseGuards(RolesGuard)
  director(@Parent() company: Company) {
    return this.companyService.findDirector(company.id);
  }
}
