import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { TryonService } from './tryon.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('👗 Virtual Try-On (AI)')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('tryon')
export class TryonController {
  constructor(private readonly tryonService: TryonService) {}

  @Post()
  @ApiOperation({ summary: 'Virtual kiyib ko\'rishni boshlash' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        humanImage: { type: 'string', example: 'https://example.com/human.jpg' },
        garmentImage: { type: 'string', example: 'https://example.com/garment.jpg' },
      },
    },
  })
  create(@Body() body: any, @Req() req: any) {
    return this.tryonService.create(req.user.userId, body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Holatni tekshirish' })
  checkStatus(@Param('id') id: string) {
    return this.tryonService.checkStatus(id);
  }

  @Get()
  @ApiOperation({ summary: 'Mening urinishlarim ro\'yxati' })
  findAll(@Req() req: any) {
    return this.tryonService.findAll(req.user.userId);
  }
}
