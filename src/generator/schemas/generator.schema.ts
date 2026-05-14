import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class AIRequest extends Document {
  @ApiProperty({ type: String, description: 'Foydalanuvchi IDsi' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @ApiProperty({ example: 'Roses', description: 'Gul turi' })
  @Prop({ required: true })
  flowerType: string;

  @ApiProperty({ example: 'Red', description: 'Rangi' })
  @Prop({ required: true })
  color: string;

  @ApiProperty({ example: 'Wedding', description: 'Tadbir' })
  @Prop()
  occasion: string;

  @ApiProperty({ example: ['Ribbon', 'Gold wrap'], description: 'Qo\'shimcha elementlar' })
  @Prop([String])
  extraElements: string[];

  @ApiProperty({ description: 'Natijaviy prompt' })
  @Prop()
  finalPrompt: string;

  @ApiProperty({ example: 'https://example.com/generated.jpg', description: 'Generatsiya qilingan rasm' })
  @Prop()
  imageUrl: string;
}

export const AIRequestSchema = SchemaFactory.createForClass(AIRequest);
