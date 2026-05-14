import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { GeneratorService } from './generator.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('🎨 AI Generator')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('generator')
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Post('generate')
  @ApiOperation({ summary: 'AI yordamida guldasta rasmini generatsiya qilish' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['flowerType', 'color'],
      properties: {
        flowerType: { type: 'string', example: 'Atirgullar va lola' },
        color: { type: 'string', example: 'Oq va pushti' },
        occasion: { type: 'string', example: 'To\'y uchun' },
        extraElements: { 
          type: 'array', 
          items: { type: 'string' }, 
          example: ['Tilla tasma', 'Yashil barglar'] 
        },
      },
    },
  })
  generate(@Body() body: any, @Req() req: any) {
    return this.generatorService.generate(req.user.userId, body);
  }

  @Get('my-history')
  @ApiOperation({ summary: 'Mening generatsiyalarim tarixi' })
  findAll(@Req() req: any) {
    return this.generatorService.getMyGenerations(req.user.userId);
  }

  @Get('elements')
  @ApiOperation({ summary: 'AI Generator uchun barcha elementlarni olish (Gullar turi, ranglar va h.k.)' })
  getElements() {
    return this.generatorService.getElements();
  }
}
