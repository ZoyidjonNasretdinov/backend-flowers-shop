import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Wishlist extends Document {
  @ApiProperty({ type: String, description: 'Foydalanuvchi IDsi' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @ApiProperty({ type: String, description: 'Gul (Mahsulot) IDsi' })
  @Prop({ type: Types.ObjectId, ref: 'Flower', required: true })
  flower: Types.ObjectId;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
