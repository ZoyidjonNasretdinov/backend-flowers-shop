import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/schemas/user.schema';
import { Flower } from '../../flowers/schemas/flower.schema';

@Schema({ timestamps: true })
export class Review extends Document {
  @ApiProperty({ type: String, description: 'Gul IDsi' })
  @Prop({ type: Types.ObjectId, ref: 'Flower', required: true })
  flower: Flower;

  @ApiProperty({ type: String, description: 'Foydalanuvchi IDsi' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @ApiProperty({ example: 5, description: 'Reyting (1-5)' })
  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @ApiProperty({ example: 'Juda chiroyli!', description: 'Sharh sarlavhasi' })
  @Prop()
  title: string;

  @ApiProperty({ example: 'Gullar yangi va hidli ekan...', description: 'Sharh matni' })
  @Prop({ required: true })
  comment: string;

  @ApiProperty({ example: ['https://example.com/photo.jpg'], description: 'Sharhga biriktirilgan rasmlar' })
  @Prop([String])
  images: string[];

  @ApiProperty({ example: true, description: 'Tasdiqlangan foydalanuvchi (sotib olgan)' })
  @Prop({ default: false })
  isVerified: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
