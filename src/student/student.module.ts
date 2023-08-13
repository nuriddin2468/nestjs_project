import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentResolver } from './student.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [StudentResolver, StudentService],
})
export class StudentModule {}
