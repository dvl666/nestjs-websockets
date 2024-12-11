import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

/**
 * Context es un objeto que contiene la solicitud, la respuesta y otros objetos que se pueden pasar a través de los interceptores y los decoradores.
 * data es el valor que se pasa al decorador. (En este ejemplo es 'HolaSoyLaData')
 */

export const GetUser = createParamDecorator(
    ( data, context: ExecutionContext ) => {
        /**
         * Codigo que se me ocurrio a mi
         */
        // if ( data ) {
        //     return context.switchToHttp().getRequest().user[data];
        // }
        console.log('data', data)
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if ( !user ) throw new InternalServerErrorException('User not found (from decorator)');
        console.log('Hola soy el usuario en el decorator', user)
        return (!data) ? user : user[data]; // Si data es undefined, devolver el usuario completo, de lo contrario devolver la propiedad solicitada
    }
); 