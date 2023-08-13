import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SchoolService {
  constructor(private prisma: PrismaService) {}
}
