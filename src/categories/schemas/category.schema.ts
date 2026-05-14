import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Category extends Document {
  @ApiProperty({ example: 'Atirgullar', description: 'Kategoriya nomi' })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({ example: 'Turli xil rangdagi va navdagi atirgullar', description: 'Kategoriya tavsifi' })
  @Prop()
  description: string;

  @ApiProperty({ example: 'https://example.com/category.jpg', description: 'Kategoriya rasmi' })
  @Prop()
  image: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
