import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CategoriesModule } from './categories/categories.module';
import { FlowersModule } from './flowers/flowers.module';
import { OrdersModule } from './orders/orders.module';
import { BlogsModule } from './blogs/blogs.module';
import { InstagramModule } from './instagram/instagram.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { TryonModule } from './tryon/tryon.module';
import { GeneratorModule } from './generator/generator.module';
import { DailyDealModule } from './daily-deal/daily-deal.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SettingsModule } from './settings/settings.module';
import { CartModule } from './cart/cart.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    DashboardModule,
    CategoriesModule,
    FlowersModule,
    OrdersModule,
    BlogsModule,
    InstagramModule,
    WishlistModule,
    TryonModule,
    GeneratorModule,
    DailyDealModule,
    ReviewsModule,
    SettingsModule,
    CartModule,
    NewsletterModule,
    SeedModule,
  ],
})
export class AppModule {}
