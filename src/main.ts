import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { HeaderInterceptor } from './interceptors/header.interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.use(cookieParser());
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Включите автоматическое преобразование
    }),
  );

  // app.enableCors({
  //   "origin": process.env.HOST_NAME,
  //   "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  //   "allowedHeaders": 'Content-Type, Accept',
  //   "preflightContinue": false,
  //   "optionsSuccessStatus": 200
  //  });

  //  app.enableCors({
  //   "origin": process.env.HOST_NAME,
  //   "methods": 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   "allowedHeaders": '*',
  //   "credentials": true,
  //   "preflightContinue": false,
  //   "optionsSuccessStatus": 200
  // });
  app.enableCors();
  app.useGlobalInterceptors(new HeaderInterceptor());

  app.useGlobalInterceptors(new LoggingInterceptor());
  
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
