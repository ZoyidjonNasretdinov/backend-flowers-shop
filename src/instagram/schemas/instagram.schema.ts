import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum InstagramStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class InstagramMention extends Document {
  @ApiProperty({ example: 'https://instagram.com/p/C123456/', description: 'Instagram post yoki storis havolasi' })
  @Prop({ required: true })
  postUrl: string;

  @ApiProperty({ type: String, description: 'Xaridor IDsi' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @ApiProperty({ type: String, description: 'Qaysi gul haqida' })
  @Prop({ type: Types.ObjectId, ref: 'Flower', required: true })
  flower: Types.ObjectId;

  @ApiProperty({ type: String, description: 'Sotuvchi IDsi' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  seller: Types.ObjectId;

  @ApiProperty({ enum: InstagramStatus, default: InstagramStatus.PENDING })
  @Prop({ type: String, enum: InstagramStatus, default: InstagramStatus.PENDING })
  status: InstagramStatus;

  @ApiProperty({ example: 'https://example.com/screenshot.jpg', description: 'Skrinshot (ixtiyoriy)' })
  @Prop()
  screenshot: string;
}

export const InstagramMentionSchema = SchemaFactory.createForClass(InstagramMention);
