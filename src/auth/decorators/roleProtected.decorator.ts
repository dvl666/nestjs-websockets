import { SetMetadata } from "@nestjs/common";
import { ValidRoles } from "../interfaces/valid-roles";

export const META_ROLES = 'roles'; // -> nos sirve para definirlo de una forma mas global

export const RoleProtected = (...roles: ValidRoles[]) => {
    
    return SetMetadata(META_ROLES, roles); // -> mete informacion extra al metodo o controlador que quiero ejecutar
}