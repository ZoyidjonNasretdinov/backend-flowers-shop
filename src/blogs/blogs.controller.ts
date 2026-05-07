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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BlogsService } from './blogs.service';
import { Blog } from './schemas/blog.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/schemas/user.schema';

@ApiTags('📰 Bloglar (News)')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Yangi blog yaratish (Faqat Admin)' })
  @ApiResponse({ status: 201, type: Blog })
  create(@Body() createBlogDto: any, @Req() req: any) {
    return this.blogsService.create(createBlogDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha bloglarni olish' })
  @ApiResponse({ status: 200, type: [Blog] })
  findAll() {
    return this.blogsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Blogni ID orqali olish' })
  @ApiResponse({ status: 200, type: Blog })
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Blogni yangilash (Faqat Admin)' })
  update(@Param('id') id: string, @Body() updateBlogDto: any) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Blogni o\'chirish (Faqat Admin)' })
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
}
