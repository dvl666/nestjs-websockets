import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });

        /**
         * Invistigar funcionamiento de super() y configService
         */

    }

    async validate(payload: JwtPayload) {
        const { id } = payload;

        const user = await this.userRepository.findOneBy({ id });

        if ( !user ) throw new UnauthorizedException('Token inválido');

        if ( !user.isActive ) throw new UnauthorizedException('Usuario inactivo');

        console.log('Hola estoy en strategy: ', user)

        return user;
    }

}