import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
  } from "@nestjs/common";
  
  import { Observable } from "rxjs";
  import { JwtService } from "@nestjs/jwt";
  import { Reflector } from "@nestjs/core";
  
  import { ROLES_KEY } from "../roles-auth.decorator";
  import { UsersService } from '../../profiles/services/users.service';
  
  
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      private reflector: Reflector,
      private usersService: UsersService,
    ) {}
  
  
    async canActivate(context: ExecutionContext) {
      try {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
          context.getHandler(),
          context.getClass(),
        ])
        if (!requiredRoles) {
          return true;
        }
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers.authorization;
        const bearer = authHeader.split(' ')[0]
        const token = authHeader.split(' ')[1]
  
        if (bearer !== 'Bearer' || !token) {
          throw new UnauthorizedException({ message: 'Not autorized!' })
        }
  
        const payload = this.jwtService.verify(token);
        const user = await this.usersService.findOneByLogin(payload.username);
        // req.user = user;
  
        let allow = false
  
        if (
          requiredRoles.includes('moderator')
          && (user.roles.moderator == true || user.roles.administrator == true)
        ) {
          allow = true
        }
  
        if (requiredRoles.includes('administrator') && user.roles.administrator == true) {
          allow = true
        }
  
        return allow
      } 
      catch (e) {
        console.log(e)
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
      }
    }
  
  }