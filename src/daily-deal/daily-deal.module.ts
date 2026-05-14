import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyDealController } from './daily-deal.controller';
import { DailyDealService } from './daily-deal.service';
import { DailyDeal, DailyDealSchema } from './schemas/daily-deal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DailyDeal.name, schema: DailyDealSchema }]),
  ],
  controllers: [DailyDealController],
  providers: [DailyDealService],
  exports: [DailyDealService],
})
export class DailyDealModule {}
