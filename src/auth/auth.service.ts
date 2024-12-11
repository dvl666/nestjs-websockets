import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  
  constructor(
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
    
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    // Buscar usuario por email
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'password']
    });

    if ( !user ) throw new UnauthorizedException('Credenciales incorrectas');

    // Comparar contraseñas
    if( !bcrypt.compareSync( password, user.password ) ) throw new UnauthorizedException('Credenciales incorrectas');
    delete user.password; // No devolver la contraseña
   
    return {
      user,
      token: this.getJwtToken( { id: user.id } ) // -> crear token
    };
  }
  
  async create(createUserDto: CreateUserDto) {
    
    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create( 
        { 
          ...userData, 
          password: bcrypt.hashSync( password, 10 ) // -> Encriptar contraseña usando bcrypt
        }
      );
      await this.userRepository.save(user);
      delete user.password; // No devolver la contraseña

      return user
    } catch (error) {
      this.handleException(error);
    }

  }

  async deleteAllUsers() {
    const query = this.userRepository.createQueryBuilder('user');

    try {
      await query.delete().where({}).execute();
      return 'All users deleted';
    } catch (error) {
      this.handleException(error);
    }

  }

  async findUserByEmail(email: string) {
    console.log(email);
    return await this.userRepository.findOneBy({ email: email });
  }

  private getJwtToken(payload: JwtPayload) {

    const token = this.jwtService.sign(payload);
    return token;

  }

  private handleException(error: any): never {

    if ( error.code === '23505' ) throw new BadRequestException( error.detail );
    console.log(error);

    throw new BadRequestException('Error en el servidor');
    
  }

}
