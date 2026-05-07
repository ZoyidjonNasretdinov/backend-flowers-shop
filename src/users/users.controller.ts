import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('👤 Profil (Users)')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Shaxsiy profil ma\'lumotlarini olish' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi ma\'lumotlari' })
  getProfile(@Req() req: any) {
    return this.usersService.findOne(req.user.userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Profil ma\'lumotlarini tahrirlash' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string', example: 'Yangi Ism' },
        email: { type: 'string', example: 'newemail@gmail.com' },
        password: { type: 'string', example: 'yangi-parol-123' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Profil muvaffaqiyatli yangilandi' })
  updateProfile(@Req() req: any, @Body() updateDto: any) {
    return this.usersService.updateProfile(req.user.userId, updateDto);
  }
}
