import { Injectable } from '@nestjs/common';
import { User } from '../../../users/models/user.model';

@Injectable()
export class UserService {
  async isCompanyOwner(user: User, companyId: string) {
    if (user.role !== 'DIRECTOR' && user.role !== 'ADMIN')
      throw Error("User's role is not Director");
    if (!user.companyId) throw Error('You have not attached to any company');
    if (user.companyId !== companyId) {
      throw Error('This company is not belongs to user');
    }
    return true;
  }

  async isUserBelongsToCompany(user: User, companyId: string) {
    if (user.companyId !== companyId) {
      throw Error('This company is not belongs to user');
    }
    return true;
  }
}
