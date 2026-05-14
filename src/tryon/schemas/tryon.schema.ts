import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum TryonStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Schema({ timestamps: true })
export class Tryon extends Document {
  @ApiProperty({ type: String, description: 'Foydalanuvchi IDsi' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @ApiProperty({ example: 'https://example.com/human.jpg', description: 'Inson rasmi' })
  @Prop({ required: true })
  humanImage: string;

  @ApiProperty({ example: 'https://example.com/garment.jpg', description: 'Kiyim rasmi' })
  @Prop({ required: true })
  garmentImage: string;

  @ApiProperty({ example: 'https://example.com/result.jpg', description: 'Natija' })
  @Prop()
  resultImage: string;

  @ApiProperty({ enum: TryonStatus, default: TryonStatus.PENDING })
  @Prop({ type: String, enum: TryonStatus, default: TryonStatus.PENDING })
  status: TryonStatus;

  @ApiProperty({ description: 'Replicate Prediction ID' })
  @Prop()
  predictionId: string;
}

export const TryonSchema = SchemaFactory.createForClass(Tryon);
