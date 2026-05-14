import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Flower, FlowerSchema } from '../flowers/schemas/flower.schema';
import { Category, CategorySchema } from '../categories/schemas/category.schema';
import { Blog, BlogSchema } from '../blogs/schemas/blog.schema';
import { Review, ReviewSchema } from '../reviews/schemas/review.schema';
import { DailyDeal, DailyDealSchema } from '../daily-deal/schemas/daily-deal.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Flower.name, schema: FlowerSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: DailyDeal.name, schema: DailyDealSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
