import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GeneratorService } from './generator.service';
import { GeneratorController } from './generator.controller';
import { AIRequest, AIRequestSchema } from './schemas/generator.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AIRequest.name, schema: AIRequestSchema }]),
    ConfigModule,
  ],
  controllers: [GeneratorController],
  providers: [GeneratorService],
})
export class GeneratorModule {}
