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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { Order, OrderStatus } from './schemas/order.schema';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/schemas/user.schema';

@ApiTags('Orders')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Yangi buyurtma berish (Xaridor uchun)' })
  create(@Body() createOrderDto: any, @Req() req: any) {
    return this.ordersService.create(createOrderDto, req.user.userId);
  }

  @Get('my-orders')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Xaridorning o\'z buyurtmalarini ko\'rishi' })
  findAllByUser(@Req() req: any) {
    return this.ordersService.findAllByUser(req.user.userId);
  }

  @Get('seller-sales')
  @Roles(Role.SELLER)
  @ApiOperation({ summary: 'Sotuvchi o\'zining sotilgan gullari buyurtmalarini ko\'rishi' })
  findBySeller(@Req() req: any) {
    return this.ordersService.findBySeller(req.user.userId);
  }

  @Patch(':id/status')
  @Roles(Role.SELLER, Role.ADMIN)
  @ApiOperation({ summary: 'Buyurtma holatini o\'zgartirish' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(id, status);
  }
}
