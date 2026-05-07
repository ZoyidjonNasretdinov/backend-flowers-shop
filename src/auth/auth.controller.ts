import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/schemas/user.schema';

@ApiTags('🔓 Tizimga kirish (Auth)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Yangi foydalanuvchini ro\'yxatdan o\'tkazish' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string', example: 'Eshmatov Toshmat' },
        email: { type: 'string', example: 'toshmat@gmail.com' },
        password: { type: 'string', example: 'parol123' },
      },
    },
  })
  @ApiResponse({ status: 201, description: '🎉 Muvaffaqiyatli ro\'yxatdan o\'tdingiz' })
  @ApiResponse({ status: 409, description: '🚫 Bu email avval band qilingan' })
  register(@Body() body: any) {
    return this.authService.register({ ...body, role: Role.USER });
  }

  @Post('admin/create-seller')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin tomonidan Seller yaratish' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string', example: 'Sotuvchi Ismi' },
        email: { type: 'string', example: 'seller@gmail.com' },
        password: { type: 'string', example: 'seller123' },
      },
    },
  })
  @ApiResponse({ status: 201, description: '👨‍🌾 Seller muvaffaqiyatli yaratildi' })
  createSeller(@Body() body: any) {
    return this.authService.register({ ...body, role: Role.SELLER });
  }

  @Post('login')
  @ApiOperation({ summary: 'Tizimga kirish (Login)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'toshmat@gmail.com' },
        password: { type: 'string', example: 'parol123' },
      },
    },
  })
  @ApiResponse({ status: 200, description: '✅ Token va user ma\'lumotlari beriladi' })
  @ApiResponse({ status: 401, description: '🔐 Email yoki parol xato' })
  login(@Body() body: any) {
    return this.authService.login(body);
  }
}
