import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Student, StudentPaginatedModel } from './entities/student.entity';
import { CreateStudentInput } from './dto/create-student.input';
import { Role } from '@prisma/client';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/models/user.model';
import { Roles, RolesGuard } from 'src/common/guards/roles.guard';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { StudentService } from './student.service';

@Resolver(() => Student)
@UseGuards(GqlAuthGuard)
export class StudentResolver {
  constructor(private studentService: StudentService) {}

  @Mutation(() => Student)
  @Roles(Role.ADMIN, Role.DIRECTOR)
  @UseGuards(RolesGuard)
  async createStudent(
    @UserEntity() user: User,
    @Args('data') data: CreateStudentInput,
    @Args('companyId') companyId?: string
  ) {
    return this.studentService.createOne(user, data, companyId);
  }

  @Query(() => StudentPaginatedModel)
  @Roles(Role.ADMIN, Role.DIRECTOR)
  @UseGuards(RolesGuard)
  studentsConnection(
    @UserEntity() user: User,
    @Args() pagination: PaginationArgs
  ) {
    return this.studentService.findAll(user, pagination);
  }
}
