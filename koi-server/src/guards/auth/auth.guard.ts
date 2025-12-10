import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { error } from '@/utils/response';
import { IS_PUBLIC_KEY } from '@/decorators/isPublic';
import { jwtConstants } from '@/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(error('认证失败！'));
    }

    try {
      Object.assign(request, {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        user: await this.jwtService.verifyAsync(token, {
          secret: jwtConstants.secret,
        }),
      });
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    if (request.query['authorization']) {
      const [type, token] =
        (request.query.authorization as string).split(' ') ?? [];
      // 只有当类型是Bearer时才返回token
      return type === 'Bearer' ? token : undefined;
    }

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
