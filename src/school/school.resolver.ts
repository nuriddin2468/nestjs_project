import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SchoolService } from './school.service';
import { School } from './entities/school.entity';
import { CreateSchoolInput } from './dto/create-school.input';
import { PrismaService } from 'nestjs-prisma';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { Role, User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { Roles, RolesGuard } from 'src/common/guards/roles.guard';

@Resolver(() => School)
@UseGuards(GqlAuthGuard)
export class SchoolResolver {
  constructor(
    private readonly schoolService: SchoolService,
    private prisma: PrismaService,
    private usersService: UsersService
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
    if (user.role === Role.ADMIN && !companyId)
      throw Error('You need to declare Company Id');
    if (user.role === Role.ADMIN && companyId) {
      return this.prisma.school.create({
        data: {
          title: data.title,
          companyId,
        },
      });
    }

    const company = await this.usersService.getUserCompany(user.id);

    if (!company) throw Error('User does not have company');

    return this.prisma.school.create({
      data: {
        title: data.title,
        companyId: company.id,
      },
    });
  }

  @Query(() => [School], { name: 'school' })
  @Roles(Role.ADMIN, Role.DIRECTOR)
  @UseGuards(RolesGuard)
  async findAll(@UserEntity() user: User) {
    if (user.role === Role.ADMIN) {
      return this.prisma.school.findMany();
    }

    const company = await this.usersService.getUserCompany(user.id);

    if (!company) throw Error('User does not have company');
    return this.prisma.school.findMany({
      where: {
        companyId: company.id,
      },
    });
  }

  @Query(() => School, { name: 'school' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.prisma.school.findUnique({ where: { id } });
  }

  // @Mutation(() => School)
  // updateSchool(
  //   @Args('updateSchoolInput') updateSchoolInput: UpdateSchoolInput
  // ) {
  //   return this.schoolService.update(updateSchoolInput.id, updateSchoolInput);
  // }

  // @Mutation(() => School)
  // removeSchool(@Args('id', { type: () => Int }) id: number) {
  //   return this.schoolService.remove(id);
  // }
}
