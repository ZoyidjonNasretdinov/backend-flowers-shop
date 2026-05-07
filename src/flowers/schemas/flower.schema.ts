import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/schemas/category.schema';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true })
export class Flower extends Document {
  @ApiProperty({ example: 'Qizil Atirgul', description: 'Gul nomi' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'Yangi uzilgan qizil atirgullar', description: 'Gul tavsifi' })
  @Prop()
  description: string;

  @ApiProperty({ example: 15000, description: 'Narxi (so\'mda)' })
  @Prop({ required: true, min: 0 })
  price: number;

  @ApiProperty({ example: 50, description: 'Zaxiradagi miqdori' })
  @Prop({ required: true, min: 0 })
  stock: number;

  @ApiProperty({ example: ['https://example.com/flower.jpg'], description: 'Rasmlar ro\'yxati' })
  @Prop([String])
  images: string[];

  @ApiProperty({ type: String, description: 'Kategoriya IDsi' })
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Category;

  @ApiProperty({ type: String, description: 'Sotuvchi (Seller) IDsi' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  seller: User;

  @ApiProperty({ example: true, description: 'Sotuvda mavjudligi' })
  @Prop({ default: true })
  isActive: boolean;
}

export const FlowerSchema = SchemaFactory.createForClass(Flower);
