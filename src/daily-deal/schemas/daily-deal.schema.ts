import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Flower } from '../../flowers/schemas/flower.schema';

@Schema({ timestamps: true })
export class DailyDeal extends Document {
  @ApiProperty({ type: String, description: 'Gul (Mahsulot) IDsi' })
  @Prop({ type: Types.ObjectId, ref: 'Flower', required: true })
  flower: Flower;

  @ApiProperty({ example: 10000, description: 'Bugun uchun maxsus narx' })
  @Prop({ required: true, min: 0 })
  dealPrice: number;

  @ApiProperty({ example: '2026-05-13T00:00:00Z', description: 'Tugash vaqti' })
  @Prop({ required: true })
  endDate: Date;

  @ApiProperty({ example: true, description: 'Faolligi' })
  @Prop({ default: true })
  isActive: boolean;
}

export const DailyDealSchema = SchemaFactory.createForClass(DailyDeal);
