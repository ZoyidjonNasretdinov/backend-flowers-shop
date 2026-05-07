import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { InstagramService } from './instagram.service';
import { InstagramMention, InstagramStatus } from './schemas/instagram.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/schemas/user.schema';

@ApiTags('📸 Instagram Mentions')
@Controller('instagram')
export class InstagramController {
  constructor(private readonly instagramService: InstagramService) {}

  @Post('submit')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Instagramda atmetka qilingan postni yuborish (Xaridor)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        flowerId: { type: 'string', example: '645a...' },
        postUrl: { type: 'string', example: 'https://instgr.am/...' },
        screenshot: { type: 'string', example: 'https://...' },
      },
    },
  })
  submit(@Body() submitDto: any, @Req() req: any) {
    return this.instagramService.submitMention(submitDto, req.user.userId);
  }

  @Get('approved')
  @ApiOperation({ summary: 'Tasdiqlangan barcha Instagram postlarni ko\'rish (Hamma uchun)' })
  getApproved() {
    return this.instagramService.getApprovedMentions();
  }

  @Get('seller/requests')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @ApiOperation({ summary: 'Sotuvchi o\'ziga tegishli yangi so\'rovlarni ko\'rishi' })
  getSellerRequests(@Req() req: any) {
    return this.instagramService.getSellerMentions(req.user.userId);
  }

  @Patch(':id/approve')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @ApiOperation({ summary: 'Sotuvchi tomonidan postni tasdiqlash yoki rad etish' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['APPROVED', 'REJECTED'] },
      },
    },
  })
  approve(
    @Param('id') id: string,
    @Body('status') status: InstagramStatus,
    @Req() req: any,
  ) {
    return this.instagramService.approveMention(id, req.user.userId, status);
  }
}
