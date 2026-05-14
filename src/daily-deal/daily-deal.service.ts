import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DailyDeal } from './schemas/daily-deal.schema';

@Injectable()
export class DailyDealService {
  constructor(
    @InjectModel(DailyDeal.name) private dailyDealModel: Model<DailyDeal>,
  ) {}

  async create(createDto: any): Promise<DailyDeal> {
    const deal = new this.dailyDealModel(createDto);
    return deal.save();
  }

  async getActiveDeal(): Promise<DailyDeal> {
    const deal = await this.dailyDealModel
      .findOne({ isActive: true, endDate: { $gt: new Date() } })
      .populate({
        path: 'flower',
        populate: { path: 'category', select: 'name' }
      })
      .sort({ createdAt: -1 })
      .exec();
    
    if (!deal) {
      throw new NotFoundException('Hozirda hech qanday kun mahsuloti mavjud emas');
    }
    return deal;
  }

  async findAll(): Promise<DailyDeal[]> {
    return this.dailyDealModel
      .find()
      .populate('flower')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, updateDto: any): Promise<DailyDeal> {
    const updated = await this.dailyDealModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Kun mahsuloti topilmadi');
    }
    return updated;
  }

  async remove(id: string): Promise<any> {
    const result = await this.dailyDealModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Kun mahsuloti topilmadi');
    }
    return { message: 'Kun mahsuloti o\'chirildi' };
  }
}
