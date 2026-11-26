import { Body, Controller, Get, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginRequestDto } from './login.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  health() {
    return this.appService.health();
  }

  @Get('/users')
  async getUsers() {
    return this.appService.getUsers();
  }

  @Post('/login')
  @HttpCode(200)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: () => ({ statusCode: 400, error: 'Invalid request' }),
    }),
  )
  async login(@Body() body: LoginRequestDto) {
    return this.appService.login(body);
  }
}
