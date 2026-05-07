import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/schemas/user.schema';
import { DashboardService } from './dashboard.service';

@ApiTags('📊 Dashboardlar')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin Dashboard (Haqiqiy statistika)' })
  @ApiResponse({ status: 200, description: 'Barcha tizim statistikasi' })
  async getAdminDashboard() {
    const stats = await this.dashboardService.getAdminStats();
    return {
      success: true,
      message: 'Xush kelibsiz Admin!',
      data: stats,
    };
  }

  @Get('seller')
  @Roles(Role.SELLER)
  @ApiOperation({ summary: 'Sotuvchi Dashboard (Shaxsiy statistika)' })
  @ApiResponse({ status: 200, description: 'Sotuvchi o\'z statistikasi' })
  async getSellerDashboard(@Request() req: any) {
    const stats = await this.dashboardService.getSellerStats(req.user.userId);
    return {
      success: true,
      message: 'Xush kelibsiz Sotuvchi!',
      data: stats,
    };
  }

  @Get('user')
  @Roles(Role.USER, Role.ADMIN, Role.SELLER)
  @ApiOperation({ summary: 'Foydalanuvchi Dashboard' })
  getUserDashboard(@Request() req: any) {
    return {
      success: true,
      message: 'Xush kelibsiz! Bu sizning shaxsiy kabinetingiz.',
      data: {
        userId: req.user.userId,
        email: req.user.email,
        role: req.user.role,
      },
    };
  }
}
