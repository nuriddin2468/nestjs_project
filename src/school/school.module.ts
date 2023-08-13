import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolResolver } from './school.resolver';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [SchoolResolver, SchoolService],
})
export class SchoolModule {}
