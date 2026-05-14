import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TryonService } from './tryon.service';
import { TryonController } from './tryon.controller';
import { Tryon, TryonSchema } from './schemas/tryon.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tryon.name, schema: TryonSchema }]),
    ConfigModule,
  ],
  controllers: [TryonController],
  providers: [TryonService],
})
export class TryonModule {}
