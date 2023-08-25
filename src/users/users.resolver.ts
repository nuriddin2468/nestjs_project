import { PrismaService } from 'nestjs-prisma';
import {
  Resolver,
  Query,
  Parent,
  Mutation,
  Args,
  ResolveField,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UsersService } from './users.service';
import { User as UserModel } from './models/user.model';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { AdminGuard } from 'src/auth/admin.guard';
import { Role, User } from '@prisma/client';

@Resolver(() => UserModel)
@UseGuards(GqlAuthGuard)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService
  ) {}

  @Query(() => UserModel)
  async me(@UserEntity() user: UserModel): Promise<UserModel> {
    return user;
  }

  @Query(() => [UserModel])
  @UseGuards(GqlAuthGuard, AdminGuard)
  async usersConnection(@UserEntity() user: UserModel): Promise<User[]> {
    if (user.role === Role.ADMIN) {
      return this.prisma.user.findMany();
    }
    const res = await this.prisma.school.findUnique({
      where: {
        id: user.schoolId,
      },
      include: {
        company: {
          include: {
            schools: {
              include: {
                users: true,
              },
            },
          },
        },
      },
    });
    const users: User[] = [];
    res?.company.schools.forEach((school) => {
      school.users.forEach((u) => users.push(u));
    });
    return users;
  }

  @Mutation(() => UserModel)
  @UseGuards(GqlAuthGuard, AdminGuard)
  async updateUser(
    @UserEntity() user: UserModel,
    @Args('data') newUserData: UpdateUserInput
  ) {
    return this.usersService.updateUser(user.id, newUserData);
  }

  @Mutation(() => UserModel)
  @UseGuards(GqlAuthGuard, AdminGuard)
  async updatePassword(
    @UserEntity() user: UserModel,
    @Args('data') changePassword: ChangePasswordInput
  ) {
    return this.usersService.changePassword(
      user.id,
      user.password,
      changePassword
    );
  }

  @ResolveField('company')
  company(@Parent() user: UserModel) {
    return this.prisma.company.findUnique({ where: { id: user.companyId } });
  }

  @ResolveField('school')
  async school(@Parent() user: UserModel) {
    if (!user.schoolId) return null;
    return this.prisma.school.findUnique({ where: { id: user?.schoolId } });
  }
}
