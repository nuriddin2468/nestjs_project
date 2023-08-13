import { CompanyService } from './company.service';
import { Module } from '@nestjs/common';
import { CompanyResolver } from './company.resolver';

@Module({
  providers: [CompanyService, CompanyResolver],
})
export class CompanyModule {}
