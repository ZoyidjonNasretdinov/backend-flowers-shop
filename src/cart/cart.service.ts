import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './schemas/cart.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

  async getCart(userId: string): Promise<Cart> {
    let cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.flower')
      .exec();
    
    if (!cart) {
      cart = await this.cartModel.create({ user: userId, items: [] });
    }
    return cart;
  }

  async addToCart(userId: string, flowerId: string, quantity: number = 1): Promise<Cart> {
    let cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      cart = new this.cartModel({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.flower.toString() === flowerId,
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ flower: new (require('mongoose').Types.ObjectId)(flowerId), quantity });
    }

    return cart.save();
  }

  async updateQuantity(userId: string, flowerId: string, quantity: number): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Savat topilmadi');

    const itemIndex = cart.items.findIndex(
      (item) => item.flower.toString() === flowerId,
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      return cart.save();
    }
    throw new NotFoundException('Mahsulot savatda topilmadi');
  }

  async removeFromCart(userId: string, flowerId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Savat topilmadi');

    cart.items = cart.items.filter((item) => item.flower.toString() !== flowerId);
    return cart.save();
  }

  async clearCart(userId: string): Promise<any> {
    await this.cartModel.findOneAndUpdate({ user: userId }, { items: [], couponCode: null });
    return { message: 'Savat tozalandi' };
  }

  async applyCoupon(userId: string, couponCode: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Savat topilmadi');

    cart.couponCode = couponCode;
    return cart.save();
  }
}
