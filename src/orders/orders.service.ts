import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderStatus } from './schemas/order.schema';
import { Flower } from '../flowers/schemas/flower.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Flower.name) private flowerModel: Model<Flower>,
  ) {}

  async create(createOrderDto: any, userId: string): Promise<Order> {
    const { items, shippingAddress } = createOrderDto;
    let totalAmount = 0;

    // 1. Zaxirani tekshirish va narxni hisoblash
    for (const item of items) {
      const flower = await this.flowerModel.findById(item.flower);
      if (!flower) {
        throw new NotFoundException(`Gul topilmadi: ${item.flower}`);
      }
      if (flower.stock < item.quantity) {
        throw new BadRequestException(`Zaxira yetarli emas: ${flower.name}`);
      }
      item.price = flower.price; // Joriy narxni saqlaymiz
      totalAmount += flower.price * item.quantity;
    }

    // 2. Buyurtmani yaratish
    const newOrder = new this.orderModel({
      user: userId,
      items,
      totalAmount,
      shippingAddress,
    });

    // 3. Zaxirani kamaytirish
    for (const item of items) {
      await this.flowerModel.findByIdAndUpdate(item.flower, {
        $inc: { stock: -item.quantity },
      });
    }

    return newOrder.save();
  }

  async findAllByUser(userId: string): Promise<Order[]> {
    return this.orderModel
      .find({ user: userId })
      .populate('items.flower')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findBySeller(sellerId: string): Promise<Order[]> {
    // Seller faqat o'zining gullari bor buyurtmalarni ko'rishi murakkabroq so'rov talab qiladi
    // Hozircha soddalashtirilgan variant
    return this.orderModel
      .find({ 'items.flower': { $in: await this.getSellerFlowerIds(sellerId) } })
      .populate('items.flower')
      .populate('user', 'fullName email')
      .exec();
  }

  private async getSellerFlowerIds(sellerId: string): Promise<any[]> {
    const flowers = await this.flowerModel.find({ seller: sellerId }).select('_id');
    return flowers.map(f => f._id);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.orderModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      throw new NotFoundException('Buyurtma topilmadi');
    }
    return order;
  }
}
