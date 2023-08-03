import { InputType, Field } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { IsEmail, IsIn, IsOptional } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  firstname?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  lastname?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field(() => Role, { nullable: true })
  @IsOptional()
  @IsIn(Object.values(Role))
  role?: Role;
}
