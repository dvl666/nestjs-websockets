import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // -> se agrega un prefijo a todas las rutas
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      // forbidNonWhitelisted: true,
      /**
       * transform: true -> Con esto se habilita la transformacion de los datos, por ejemplo si se recibe un string
       * enableImplicitConversion: true -> Con esto se habilita la conversion implicita de los tipos de datos, por ejemplo
       * si se espera un numero y se recibe un string 
       */
      // transform: true,
      // transformOptions: {
      //   enableImplicitConversion: true,
      // }
    })
  ); // -> se agregan validaciones a todas las rutas
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
