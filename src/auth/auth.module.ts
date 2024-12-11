import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([User]),
    
    PassportModule.register({ defaultStrategy: 'jwt' }), // ->  Se configura con la estrategia predeterminada jwt
    
    JwtModule.registerAsync({ // Configura el manejo de los tokens JWT
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        console.log('JWT_SECRET', configService.get('JWT_SECRET'))
        return {
          secret: await configService.get('JWT_SECRET'),
          signOptions: { 
            expiresIn: '2h' 
          },
        }
      }
    })
    
  ],
  exports: [TypeOrmModule, PassportModule, JwtStrategy, JwtModule, AuthService]
})
export class AuthModule {}