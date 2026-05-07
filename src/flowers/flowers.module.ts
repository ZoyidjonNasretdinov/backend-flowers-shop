import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlowersService } from './flowers.service';
import { FlowersController } from './flowers.controller';
import { Flower, FlowerSchema } from './schemas/flower.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Flower.name, schema: FlowerSchema }]),
  ],
  controllers: [FlowersController],
  providers: [FlowersService],
  exports: [FlowersService],
})
export class FlowersModule {}
