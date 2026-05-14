import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Newsletter extends Document {
  @ApiProperty({ example: 'user@example.com', description: 'Obunachi emaili' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ example: true, description: 'Obuna holati' })
  @Prop({ default: true })
  isActive: boolean;
}

export const NewsletterSchema = SchemaFactory.createForClass(Newsletter);
