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

  @ApiProperty({ example: 12000, description: 'Chegirmali narxi', required: false })
  @Prop({ min: 0 })
  discountPrice: number;

  @ApiProperty({ example: 20, description: 'Chegirma foizi', required: false })
  @Prop({ min: 0, max: 100 })
  discountPercent: number;

  @ApiProperty({ example: 'Weddings', description: 'Tadbir turi (Occasion)', required: false })
  @Prop()
  occasion: string;

  @ApiProperty({ example: ['Red', 'Pink'], description: 'Gullar ranglari', required: false })
  @Prop([String])
  color: string[];

  @ApiProperty({ example: ['For Her', 'Corporate Gifts'], description: 'Kim uchun (Recipient)', required: false })
  @Prop([String])
  recipient: string[];

  @ApiProperty({ example: 4.5, description: 'Reyting (1-5)', required: false })
  @Prop({ min: 0, max: 5, default: 0 })
  rating: number;

  @ApiProperty({ example: ['https://example.com/flower.jpg'], description: 'Rasmlar ro\'yxati' })
  @Prop([String])
  images: string[];

  @ApiProperty({ type: String, description: 'Kategoriya IDsi' })
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Category;

  @ApiProperty({ type: String, description: 'Sotuvchi (Seller) IDsi' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  seller: User;

  @ApiProperty({ example: 'FLW-001', description: 'SKU (Stock Keeping Unit)', required: false })
  @Prop()
  sku: string;

  @ApiProperty({ example: ['Bouquets', 'Flowers'], description: 'Teglar', required: false })
  @Prop([String])
  tags: string[];

  @ApiProperty({ 
    example: [
      { name: 'Standard', price: 45000 },
      { name: 'Deluxe', price: 65000 },
      { name: 'Premium', price: 90000 }
    ], 
    description: 'O\'lchamlar va narxlar',
    required: false 
  })
  @Prop({ type: [{ name: String, price: Number }] })
  sizes: { name: string, price: number }[];

  @ApiProperty({ example: 245, description: 'Sharhlar soni', required: false })
  @Prop({ default: 0 })
  reviewCount: number;

  @ApiProperty({ 
    example: [
      { key: 'Flower Type', value: 'Mixed Flower' },
      { key: 'Bouquet Size', value: 'Small, Medium, Large' }
    ],
    description: 'Qo\'shimcha ma\'lumotlar (Additional Information tab)',
    required: false
  })
  @Prop({ type: [{ key: String, value: String }] })
  additionalInfo: { key: string, value: string }[];

  @ApiProperty({ example: true, description: 'Sotuvda mavjudligi' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ example: false, description: 'Asosiy sahifada ko\'rsatish' })
  @Prop({ default: false })
  isFeatured: boolean;

  @ApiProperty({ example: true, description: 'Yangi kelgan mahsulot' })
  @Prop({ default: true })
  isNewArrival: boolean;

  @ApiProperty({ example: false, description: 'Kun mahsuloti (Deal of the Day)' })
  @Prop({ default: false })
  isDealOfTheDay: boolean;
}

export const FlowerSchema = SchemaFactory.createForClass(Flower);
