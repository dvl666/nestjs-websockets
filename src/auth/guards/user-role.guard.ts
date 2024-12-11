import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLES } from '../decorators/roleProtected.decorator';

/**
 * Para que un guard sea valido debe implementar la interfaz CanActivate
 * canActivate tiene que regresar un booleano, una promesa de un booleano o un observable de un booleano
 */

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector // -> es un servicio que nos permite leer los metadatos de los controladores
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> { // operador ternario

    /**
     * Aca va la logica de validacion
     */

    const validRoles: string[] = this.reflector.get<string[]>(META_ROLES, context.getHandler()); // -> obtiene los roles que se pasaron en el decorador SetMetadata, se usa META_ROLES para no tener que escribir el string 'roles' en todos lados
    if (!validRoles) return true; // -> si no hay roles validos, se permite el acceso
    if (!validRoles.length) return true; // -> si no hay roles validos, se permite el acceso

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    /**
     * forEcah no regresa un valor, por lo que no puedo hacer un return dentro de un forEach, por eso forEach no funciona
     */

    // userRoles.forEach( ( role: string ) => {
    //   console.log('role', role)
    //   return validRoles.includes(role);
    // });

    /**
     * El metodo some regresa un booleano si al menos un elemento cumple con la condicion, al devolver true se sale del ciclo
     */

    for (const role of user.roles) {
      if (validRoles.includes(role)) return true;
    }
    
    throw new UnauthorizedException('You do not have permission to access this route');

  }
}
