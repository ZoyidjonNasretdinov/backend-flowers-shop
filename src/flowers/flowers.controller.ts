import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FlowersService } from './flowers.service';
import { Flower } from './schemas/flower.schema';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/schemas/user.schema';

@ApiTags('Flowers')
@Controller('flowers')
export class FlowersController {
  constructor(private readonly flowersService: FlowersService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @ApiOperation({ summary: 'Yangi gul qo\'shish (Faqat Seller va Admin)' })
  @ApiResponse({ status: 201, type: Flower })
  create(@Body() createFlowerDto: any, @Req() req: any) {
    return this.flowersService.create(createFlowerDto, req.user.userId);
  }

  @Get('landing')
  @ApiOperation({ summary: 'Landing page uchun mahsulotlarni olish (Featured, New Arrivals, Random)' })
  getLandingPage() {
    return this.flowersService.getLandingPage();
  }

  @Get()
  @ApiOperation({ summary: 'Barcha gullarni olish (Filtrlar bilan)' })
  @ApiQuery({ name: 'search', required: false, description: 'Nomi bo\'yicha qidirish' })
  @ApiQuery({ name: 'category', required: false, description: 'Kategoriya IDsi' })
  @ApiQuery({ name: 'occasion', required: false, description: 'Tadbir turi (masalan: Weddings, Birthday)' })
  @ApiQuery({ name: 'color', required: false, isArray: true, description: 'Gullar ranglari' })
  @ApiQuery({ name: 'recipient', required: false, isArray: true, description: 'Kim uchun (masalan: For Her, For Kids)' })
  @ApiQuery({ name: 'inStock', required: false, type: Boolean, description: 'Zaxirada borligi (true/false)' })
  @ApiQuery({ name: 'isFeatured', required: false, type: Boolean, description: 'Asosiy sahifadagi mahsulotlar' })
  @ApiQuery({ name: 'isNewArrival', required: false, type: Boolean, description: 'Yangi kelgan mahsulotlar' })
  @ApiQuery({ name: 'isDealOfTheDay', required: false, type: Boolean, description: 'Kun mahsulotlari' })
  @ApiQuery({ name: 'rating', required: false, type: Number, description: 'Minimal reyting (1-5)' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['newest', 'oldest', 'price_low', 'price_high', 'rating'], description: 'Saralash tartibi' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Sahifadagi elementlar soni' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Sahifa raqami' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiResponse({ status: 200 })
  findAll(@Query() query: any) {
    return this.flowersService.findAll(query);
  }

  @Get('my-flowers')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SELLER)
  @ApiOperation({ summary: 'Sotuvchining o\'z gullarini olish' })
  getMyFlowers(@Req() req: any) {
    return this.flowersService.findBySeller(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Gulni ID orqali olish (Batafsil ma\'lumot va o\'xshash mahsulotlar bilan)' })
  @ApiResponse({ status: 200, description: 'Gul ma\'lumotlari va o\'xshash mahsulotlar' })
  findOne(@Param('id') id: string) {
    return this.flowersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @ApiOperation({ summary: 'Gul ma\'lumotlarini yangilash' })
  update(@Param('id') id: string, @Body() updateFlowerDto: any, @Req() req: any) {
    const sellerId = req.user.role === Role.ADMIN ? undefined : req.user.userId;
    return this.flowersService.update(id, updateFlowerDto, sellerId);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @ApiOperation({ summary: 'Gulni o\'chirish' })
  remove(@Param('id') id: string, @Req() req: any) {
    const sellerId = req.user.role === Role.ADMIN ? undefined : req.user.userId;
    return this.flowersService.remove(id, sellerId);
  }
}
