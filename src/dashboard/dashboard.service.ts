import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, Role } from '../users/schemas/user.schema';
import { Flower } from '../flowers/schemas/flower.schema';
import { Order } from '../orders/schemas/order.schema';
import { Category } from '../categories/schemas/category.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Flower.name) private flowerModel: Model<Flower>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async getAdminStats() {
    const [totalUsers, totalSellers, totalFlowers, totalCategories, orders] = await Promise.all([
      this.userModel.countDocuments({ role: Role.USER }),
      this.userModel.countDocuments({ role: Role.SELLER }),
      this.flowerModel.countDocuments(),
      this.categoryModel.countDocuments(),
      this.orderModel.find().exec(),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalUsers,
      totalSellers,
      totalFlowers,
      totalCategories,
      totalOrders: orders.length,
      totalRevenue,
    };
  }

  async getSellerStats(sellerId: string) {
    const sellerFlowers = await this.flowerModel.find({ seller: sellerId }).select('_id');
    const flowerIds = sellerFlowers.map(f => f._id);

    // Faqat ushbu sellerning gullari bor buyurtmalarni olish
    const orders = await this.orderModel.find({
      'items.flower': { $in: flowerIds }
    }).exec();

    let myRevenue = 0;
    let myTotalSoldItems = 0;

    orders.forEach(order => {
      order.items.forEach(item => {
        if (flowerIds.some(id => id.toString() === item.flower.toString())) {
          myRevenue += item.price * item.quantity;
          myTotalSoldItems += item.quantity;
        }
      });
    });

    return {
      myTotalFlowers: flowerIds.length,
      myTotalOrders: orders.length,
      myRevenue,
      myTotalSoldItems,
    };
  }
}
