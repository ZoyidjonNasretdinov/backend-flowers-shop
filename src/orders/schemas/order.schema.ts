import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class Order extends Document {
  @ApiProperty({ type: String, description: 'Xaridor IDsi' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @ApiProperty({
    example: [{ flower: '645a...', quantity: 2, price: 15000 }],
    description: 'Buyurtma qilingan gullar',
  })
  @Prop([
    {
      flower: { type: Types.ObjectId, ref: 'Flower' },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ])
  items: any[];

  @ApiProperty({ example: 30000, description: 'Umumiy summa' })
  @Prop({ required: true })
  totalAmount: number;

  @ApiProperty({ enum: OrderStatus, default: OrderStatus.PENDING })
  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty({ example: 'Toshkent sh., Chilonzor 5', description: 'Yetkazib berish manzili' })
  @Prop({ required: true })
  shippingAddress: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
