import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Cart')
@Controller('cart')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Savatni olish' })
  getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('add')
  @ApiOperation({ summary: 'Savatga mahsulot qo\'shish' })
  @ApiBody({ schema: { properties: { flowerId: { type: 'string' }, quantity: { type: 'number' } } } })
  addToCart(@Body() body: { flowerId: string; quantity: number }, @Req() req: any) {
    return this.cartService.addToCart(req.user.userId, body.flowerId, body.quantity);
  }

  @Patch('update')
  @ApiOperation({ summary: 'Savatdagi mahsulot miqdorini yangilash' })
  @ApiBody({ schema: { properties: { flowerId: { type: 'string' }, quantity: { type: 'number' } } } })
  updateQuantity(@Body() body: { flowerId: string; quantity: number }, @Req() req: any) {
    return this.cartService.updateQuantity(req.user.userId, body.flowerId, body.quantity);
  }

  @Delete('remove/:flowerId')
  @ApiOperation({ summary: 'Savatdan mahsulotni o\'chirish' })
  removeFromCart(@Param('flowerId') flowerId: string, @Req() req: any) {
    return this.cartService.removeFromCart(req.user.userId, flowerId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Savatni tozalash' })
  clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user.userId);
  }

  @Post('apply-coupon')
  @ApiOperation({ summary: 'Kupon qo\'llash' })
  @ApiBody({ schema: { properties: { couponCode: { type: 'string' } } } })
  applyCoupon(@Body() body: { couponCode: string }, @Req() req: any) {
    return this.cartService.applyCoupon(req.user.userId, body.couponCode);
  }
}
