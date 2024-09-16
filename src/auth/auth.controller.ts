import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request, Query, HttpException, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from './user.decorator';
import { RequestAuthDto } from './dto/request-auth.dto';
import { UserPayloadDto } from './dto/user-payload.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() data: RequestAuthDto, @Req() request,  @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(data);
    if (result?.error) {
      throw new HttpException(result, HttpStatus.BAD_REQUEST);
    }
    //response.setHeader('Set-Cookie', `jwt=${result.token}`);
    const isLocal = request.hostname === 'localhost';
    console.log(request.hostname)
    console.log(isLocal)
    response.cookie('jwt', result.token, {
      httpOnly: true,
      secure: !isLocal, // Secure только для HTTPS
      sameSite: isLocal ? 'lax' : 'none', // Lax для локального тестирования
      path: '/',
    });
    //response.cookie('jwt', result.token, { httpOnly: true, secure: true, sameSite: 'none', path: '/' });
    return {
      role: result.role,
      message: 'Авторизация прошла успешно!'
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() registerDto: { username: string; password: string; roles: string[] }) {
    // Здесь вы можете добавить логику для регистрации пользователя
    // Например, сохранить пользователя в базе данных
    return { message: 'User registered successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() user: UserPayloadDto) {
    return user;
  }
}
