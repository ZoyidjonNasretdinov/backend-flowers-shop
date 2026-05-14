import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Blog extends Document {
  @ApiProperty({ example: 'Gullarni parvarish qilish sirlari', description: 'Blog sarlavhasi' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ example: 'Ushbu maqolada biz gullarni qanday qilib uzoq vaqt yangi saqlash haqida gaplashamiz...', description: 'Blog matni' })
  @Prop({ required: true })
  content: string;

  @ApiProperty({ example: 'https://example.com/blog-image.jpg', description: 'Blog uchun asosiy rasm' })
  @Prop()
  image: string;

  @ApiProperty({ example: 'Muallif (Admin) IDsi' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @ApiProperty({ example: 'Wedding Bouquet', description: 'Blog kategoriyasi' })
  @Prop()
  category: string;

  @ApiProperty({ example: 'Lorem ipsum dolor sit amet...', description: 'Blog qisqa matni' })
  @Prop()
  excerpt: string;

  @ApiProperty({ example: '12 min Read', description: 'O\'qish vaqti' })
  @Prop()
  readingTime: string;

  @ApiProperty({ example: ['parvarish', 'gullar'], description: 'Teglar ro\'yxati' })
  @Prop([String])
  tags: string[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
