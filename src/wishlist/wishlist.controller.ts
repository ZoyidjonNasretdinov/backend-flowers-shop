import { Controller, Get, Post, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('💖 Tanlanganlar (Wishlist)')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post(':flowerId')
  @ApiOperation({ summary: 'Tanlanganlarga qo\'shish/o\'chirish (Toggle)' })
  toggle(@Param('flowerId') flowerId: string, @Req() req: any) {
    return this.wishlistService.toggle(req.user.userId, flowerId);
  }

  @Get()
  @ApiOperation({ summary: 'Foydalanuvchining barcha tanlanganlarini olish' })
  findAll(@Req() req: any) {
    return this.wishlistService.findAll(req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ID orqali o\'chirish' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.wishlistService.remove(req.user.userId, id);
  }
}
