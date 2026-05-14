import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DailyDealService } from './daily-deal.service';
import { DailyDeal } from './schemas/daily-deal.schema';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/schemas/user.schema';

@ApiTags('Daily Deal')
@Controller('daily-deal')
export class DailyDealController {
  constructor(private readonly dailyDealService: DailyDealService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Yangi kun mahsulotini qo\'shish (Faqat Admin)' })
  @ApiResponse({ status: 201, type: DailyDeal })
  create(@Body() createDto: any) {
    return this.dailyDealService.create(createDto);
  }

  @Get('active')
  @ApiOperation({ summary: 'Hozirgi faol kun mahsulotini olish' })
  @ApiResponse({ status: 200, type: DailyDeal })
  getActiveDeal() {
    return this.dailyDealService.getActiveDeal();
  }

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Barcha kun mahsulotlari tarixini ko\'rish (Faqat Admin)' })
  findAll() {
    return this.dailyDealService.findAll();
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Kun mahsulotini yangilash (Faqat Admin)' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.dailyDealService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Kun mahsulotini o\'chirish (Faqat Admin)' })
  remove(@Param('id') id: string) {
    return this.dailyDealService.remove(id);
  }
}
