import { Module } from '@nestjs/common';
import { CompanyResolver } from './company.resolver';
import { UserService } from '../common/services/user/user.service';

@Module({
  providers: [CompanyResolver, UserService],
})
export class CompanyModule {}
