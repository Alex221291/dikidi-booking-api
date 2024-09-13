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
  app.enableCors({
    origin: [process.env.LOCAL_HOST_NAME, process.env.DEV_HOST_NAME],
    credentials: true,
  });

  app.use((req, res, next) => {
    const allowedOrigins = [process.env.LOCAL_HOST_NAME, process.env.DEV_HOST_NAME];
    const origin = req.headers.origin;
  
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
  
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
  
    next();
  });
  
  app.useGlobalInterceptors(new HeaderInterceptor());

  app.useGlobalInterceptors(new LoggingInterceptor());
  
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
