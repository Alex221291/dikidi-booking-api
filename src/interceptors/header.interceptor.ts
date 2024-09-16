import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse();
    const req = context.switchToHttp().getRequest();
    const allowedOrigins = [process.env.LOCAL_HOST_NAME, process.env.DEV_HOST_NAME];
    const origin = req.headers.origin;

    console.log(req.cookie?.jwt);
    if (res && typeof res.setHeader === 'function') {
      if (origin && allowedOrigins.includes(origin)) {
        console.log('host - ' + origin);
        res.setHeader('Access-Control-Allow-Origin', origin);
      } else {
        res.setHeader('Access-Control-Allow-Origin', 'null'); // Установите значение по умолчанию, если заголовок отсутствует или не разрешен
      }
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie');
    }

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return; // Завершаем обработку запроса
    }

    return next.handle();
  }
}
