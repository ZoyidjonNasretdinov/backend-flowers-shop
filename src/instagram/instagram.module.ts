import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstagramService } from './instagram.service';
import { InstagramController } from './instagram.controller';
import { InstagramMention, InstagramMentionSchema } from './schemas/instagram.schema';
import { Flower, FlowerSchema } from '../flowers/schemas/flower.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InstagramMention.name, schema: InstagramMentionSchema },
      { name: Flower.name, schema: FlowerSchema },
    ]),
  ],
  controllers: [InstagramController],
  providers: [InstagramService],
})
export class InstagramModule {}
