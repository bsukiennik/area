import { Body, Controller, Get, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { LoginRequestDto } from './login.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns service health status.',
  })
  @ApiOkResponse({
    description: 'Service is healthy',
    schema: { example: { status: 'ok' } },
  })
  @Get('/health')
  health() {
    return this.appService.health();
  }

  @ApiTags('users')
  @ApiOperation({
    summary: 'List users',
    description: 'Returns all users.',
  })
  @ApiOkResponse({
    description: 'List of users',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          username: { type: 'string', example: 'user' },
          email: { type: 'string', example: 'user@test.area' },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-01-01T00:00:00Z',
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Database error',
    schema: { example: { error: 'database error' } },
  })
  @Get('/users')
  async getUsers() {
    return this.appService.getUsers();
  }

  @ApiTags('auth')
  @ApiOperation({
    summary: 'Login',
    description: 'Authenticate a user and return a JWT.',
  })
  @ApiBody({ type: LoginRequestDto })
  @ApiOkResponse({
    description: 'Login successful',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          username: 'user',
          email: 'user@test.area',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request',
    schema: { example: { error: 'Invalid request' } },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: { example: { error: 'Invalid username or password' } },
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    schema: { example: { error: 'Could not generate token' } },
  })
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
