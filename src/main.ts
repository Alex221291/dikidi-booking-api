import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { HeaderInterceptor } from './interceptors/header.interceptor';
import * as cookieParser from 'cookie-parser';
import { all } from 'axios';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');

  app.use(cookieParser());

  app.enableCors({
    origin: [process.env.LOCAL_HOST_NAME, process.env.DEV_HOST_NAME],
    credentials: true,
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Включите автоматическое преобразование
    }),
  );
  
  app.useGlobalInterceptors(new HeaderInterceptor());

  app.useGlobalInterceptors(new LoggingInterceptor());
  
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
