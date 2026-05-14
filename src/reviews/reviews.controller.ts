import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { Review } from './schemas/review.schema';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Sharh qoldirish' })
  @ApiResponse({ status: 201, type: Review })
  create(@Body() createDto: any, @Req() req: any) {
    return this.reviewsService.create(createDto, req.user.userId);
  }

  @Get('flower/:flowerId')
  @ApiOperation({ summary: 'Gul uchun barcha sharhlarni olish' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['newest', 'oldest', 'rating_high', 'rating_low'] })
  findByFlower(@Param('flowerId') flowerId: string, @Query() query: any) {
    return this.reviewsService.findByFlower(flowerId, query);
  }
}
