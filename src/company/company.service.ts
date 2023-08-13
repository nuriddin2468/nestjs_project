/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { User } from 'src/users/models/user.model';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async fetchUserCompany(user: User) {
    if (!user.schoolId) throw Error('User has no school attached...');
    const school = await this.prisma.school.findUnique({
      where: { id: user.schoolId },
      select: { company: true },
    });
    return school?.company;
  }
}
