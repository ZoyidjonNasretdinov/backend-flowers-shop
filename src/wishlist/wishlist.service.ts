import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist } from './schemas/wishlist.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<Wishlist>,
  ) {}

  async toggle(userId: string, flowerId: string) {
    const existing = await this.wishlistModel.findOne({ user: userId, flower: flowerId });
    
    if (existing) {
      await this.wishlistModel.deleteOne({ _id: existing._id });
      return { added: false, message: 'Tanlanganlardan o\'chirildi' };
    }

    const newWish = new this.wishlistModel({ user: userId, flower: flowerId });
    await newWish.save();
    return { added: true, message: 'Tanlanganlarga qo\'shildi' };
  }

  async findAll(userId: string) {
    return this.wishlistModel
      .find({ user: userId })
      .populate('flower')
      .sort({ createdAt: -1 })
      .exec();
  }

  async remove(userId: string, id: string) {
    const result = await this.wishlistModel.deleteOne({ _id: id, user: userId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Topilmadi');
    }
    return { message: 'O\'chirildi' };
  }
}
