import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './logger/logging.interceptor';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Включите автоматическое преобразование
    }),
  );

  app.enableCors({
    "origin": process.env.HOST_NAME,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "allowedHeaders": 'Content-Type, Accept',
    "preflightContinue": false,
    "optionsSuccessStatus": 200
   });

  app.useGlobalInterceptors(new LoggingInterceptor());
  
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
