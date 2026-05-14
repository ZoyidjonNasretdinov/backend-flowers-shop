import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Flower } from '../../flowers/schemas/flower.schema';

@Schema({ timestamps: true })
export class Cart extends Document {
  @ApiProperty({ type: String, description: 'Foydalanuvchi IDsi' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId;

  @ApiProperty({
    example: [{ flower: '645a...', quantity: 2 }],
    description: 'Savatdagi mahsulotlar',
  })
  @Prop([
    {
      flower: { type: Types.ObjectId, ref: 'Flower' },
      quantity: { type: Number, default: 1 },
    },
  ])
  items: { flower: Types.ObjectId | Flower; quantity: number }[];

  @ApiProperty({ example: 'SUMMER20', description: 'Qo\'llanilgan kupon kodi', required: false })
  @Prop()
  couponCode: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
