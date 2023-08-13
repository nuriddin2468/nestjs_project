import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { StudentService } from './student.service';
import { Student } from './entities/student.entity';
import { CreateStudentInput } from './dto/create-student.input';
import { PrismaService } from 'nestjs-prisma';
import { AuthService } from 'src/auth/auth.service';
import { Role } from '@prisma/client';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { Roles, RolesGuard } from 'src/common/guards/roles.guard';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Student)
@UseGuards(GqlAuthGuard)
export class StudentResolver {
  constructor(
    private readonly studentService: StudentService,
    private prisma: PrismaService,
    private auth: AuthService,
    private userService: UsersService
  ) {}

  @Mutation(() => Student)
  @Roles(Role.ADMIN, Role.DIRECTOR)
  @UseGuards(RolesGuard)
  async createStudent(
    @UserEntity() user: User,
    @Args('data') data: CreateStudentInput
  ) {
    if (user.role === 'ADMIN') {
      return this.auth.createUser(data, Role.STUDENT);
    }
    const userData = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        school: {
          include: {
            company: {
              include: {
                schools: true,
              },
            },
          },
        },
      },
    });
    const company = userData?.school?.company;
    if (!company) throw Error('You have no company');
    const school = company.schools.find((res) => res.id === data.schoolId);
    if (!school) throw Error('School not found');
    return this.auth.createUser(data, Role.STUDENT);
  }

  @Query(() => [Student])
  @Roles(Role.ADMIN, Role.DIRECTOR)
  @UseGuards(RolesGuard)
  fetchStudents() {
    return this.prisma.student.findMany();
  }

  // @Query(() => Student, { name: 'student' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.studentService.findOne(id);
  // }

  // @Mutation(() => Student)
  // updateStudent(
  //   @Args('updateStudentInput') updateStudentInput: UpdateStudentInput
  // ) {
  //   return this.studentService.update(
  //     updateStudentInput.id,
  //     updateStudentInput
  //   );
  // }

  // @Mutation(() => Student)
  // removeStudent(@Args('id', { type: () => Int }) id: number) {
  //   return this.studentService.remove(id);
  // }
}
