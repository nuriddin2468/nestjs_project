import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { SchoolService } from './school.service';
import { School } from './entities/school.entity';
import { CreateSchoolInput } from './dto/create-school.input';
import { PrismaService } from 'nestjs-prisma';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { Role, User } from '@prisma/client';
import { Roles, RolesGuard } from 'src/common/guards/roles.guard';
import { SchoolPaginatedModel } from './entities/schoolPaginated.model';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { Company } from 'src/company/models/company.model';

@Resolver(() => School)
@UseGuards(GqlAuthGuard)
export class SchoolResolver {
  constructor(
    private readonly schoolService: SchoolService,
    private prisma: PrismaService
  ) {}

  @Mutation(() => School)
  @Roles(Role.ADMIN, Role.DIRECTOR)
  @UseGuards(RolesGuard)
  async createSchool(
    @UserEntity() user: User,
    @Args('data') data: CreateSchoolInput,
    @Args('companyId', { type: () => String, nullable: true })
    companyId: string
  ) {
    return this.schoolService.createOne(user, data, companyId);
  }

  @Query(() => SchoolPaginatedModel)
  @Roles(Role.ADMIN, Role.DIRECTOR)
  @UseGuards(RolesGuard)
  async schoolsConnection(
    @UserEntity() user: User,
    @Args() pagination: PaginationArgs
  ) {
    return this.schoolService.findAll(user, pagination);
  }

  @Query(() => School, { name: 'school' })
  school(
    @UserEntity() user: User,
    @Args('id', { type: () => String }) id: string
  ) {
    return this.schoolService.findOne(user, id);
  }

  @ResolveField('company', () => Company)
  async company(@Parent() school: School) {
    return this.prisma.company.findFirstOrThrow({
      where: {
        id: school.companyId,
      },
    });
  }
}
