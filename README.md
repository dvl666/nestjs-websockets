<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Teslo API

1. Clonar repositorio
```
https://github.com/dvl666/nestjs-teslo-api.git
```

2. Ejecutar npm i
```
npm i
```

3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```

4. Tener instalado docker

5. Instalar la imagen de postgres (version 14.3)
```
docker pull postgres:14.3
```

6. Levantar la base de datos
```
docker-compose up -d
```

7. Clonar el archivo .env.template y renombrar la copia a .env (asignar valores si es necesario)

8. Levantar el proyecto con:
```
npm run start:dev
```

9. Mandar solicitud GET a:
```
http://localhost:3000/api/seed
```

## Stack utilizado
* TypeORM
* Nestjs

***Este repositorio contiene comentarios tanto de funcionamiento de TypeScript como de funcionalidades de NestJs, todo con el objetivo de su posterior entendimiento***