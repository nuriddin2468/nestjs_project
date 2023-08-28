/*
https://docs.nestjs.com/guards#guards
*/
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { Observable } from 'rxjs';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const data = GqlExecutionContext.create(context);
    const roles = this.reflector.get<string[]>('roles', data.getHandler());
    if (!roles) return true;
    const userRole = data.getContext().req.user['role'];
    if (!!roles.find((res) => res === userRole)) return true;
    throw UnauthorizedException;
  }
}
