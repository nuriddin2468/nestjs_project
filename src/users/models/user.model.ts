import 'reflect-metadata';
import {
  ObjectType,
  registerEnumType,
  HideField,
  Field,
} from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { BaseModel } from 'src/common/models/base.model';
import { Role } from '@prisma/client';
import { Company } from '../../company/models/company.model';
import { School } from 'src/school/entities/school.entity';

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});

@ObjectType()
export class User extends BaseModel {
  @Field()
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: true })
  firstname?: string;

  @Field(() => String, { nullable: true })
  lastname?: string;

  @Field(() => Role)
  role: Role;

  @Field(() => Company, { nullable: true })
  company?: Company;

  @Field(() => String)
  schoolId: string;

  @Field(() => School, { nullable: true })
  school?: School;

  @HideField()
  password: string;
}
