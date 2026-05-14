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

  @ApiProperty({
    example: { 
      firstName: 'John', 
      lastName: 'Doe', 
      email: 'john@example.com', 
      phone: '+998901234567',
      address: 'Chilonzor 5',
      city: 'Tashkent',
      zipCode: '100000'
    },
    description: 'Xaridor ma\'lumotlari'
  })
  @Prop({ type: Object, required: true })
  billingDetails: any;

  @ApiProperty({ example: 384000, description: 'Mahsulotlar summasi' })
  @Prop({ required: true })
  subTotal: number;

  @ApiProperty({ example: 0, description: 'Yetkazib berish narxi' })
  @Prop({ default: 0 })
  shippingCost: number;

  @ApiProperty({ example: 0, description: 'Soliqlar' })
  @Prop({ default: 0 })
  taxes: number;

  @ApiProperty({ example: 30000, description: 'Kupon chegirmasi' })
  @Prop({ default: 0 })
  couponDiscount: number;

  @ApiProperty({ example: 354000, description: 'Umumiy summa' })
  @Prop({ required: true })
  totalAmount: number;

  @ApiProperty({ example: 'Paypal', description: 'To\'lov usuli' })
  @Prop({ required: true })
  paymentMethod: string;

  @ApiProperty({ example: 'TR-542SSFE', description: 'Tranzaksiya IDsi', required: false })
  @Prop()
  transactionId: string;

  @ApiProperty({ example: '2026-05-20T00:00:00Z', description: 'Taxminiy yetkazib berish vaqti', required: false })
  @Prop()
  estimatedDeliveryDate: Date;

  @ApiProperty({ enum: OrderStatus, default: OrderStatus.PENDING })
  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty({ 
    example: { 
      placed: '2026-05-12T10:00:00Z', 
      accepted: '2026-05-12T10:15:00Z' 
    },
    description: 'Har bir statusga o\'tgan vaqtlar'
  })
  @Prop({ type: Object, default: {} })
  statusDates: {
    placed?: Date;
    accepted?: Date;
    inProgress?: Date;
    onTheWay?: Date;
    delivered?: Date;
  };

  @ApiProperty({ example: 'Toshkent sh., Chilonzor 5', description: 'Yetkazib berish manzili' })
  @Prop({ required: true })
  shippingAddress: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
