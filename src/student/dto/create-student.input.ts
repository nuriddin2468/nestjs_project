import { InputType, Int, Field, HideField } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class CreateStudentInput {
  @Field(() => String, { nullable: false })
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: false })
  password: string;

  @Field(() => String, { nullable: false })
  schoolId: string;
}
