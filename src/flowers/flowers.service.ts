import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Flower } from './schemas/flower.schema';

@Injectable()
export class FlowersService {
  constructor(
    @InjectModel(Flower.name) private flowerModel: Model<Flower>,
  ) {}

  async create(createFlowerDto: any, sellerId: string): Promise<Flower> {
    const createdFlower = new this.flowerModel({
      ...createFlowerDto,
      seller: sellerId,
    });
    return createdFlower.save();
  }

  async findAll(query: any): Promise<any> {
    const { search, category, minPrice, maxPrice, limit = 10, page = 1 } = query;
    
    const filters: any = { isActive: true };

    if (search) {
      filters.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      filters.category = category;
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.flowerModel
        .find(filters)
        .populate('category', 'name')
        .populate('seller', 'fullName email')
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .exec(),
      this.flowerModel.countDocuments(filters),
    ]);

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Flower> {
    const flower = await this.flowerModel
      .findById(id)
      .populate('category', 'name')
      .populate('seller', 'fullName email')
      .exec();
    if (!flower) {
      throw new NotFoundException('Gul topilmadi');
    }
    return flower;
  }

  async findBySeller(sellerId: string): Promise<Flower[]> {
    return this.flowerModel
      .find({ seller: sellerId })
      .populate('category', 'name')
      .exec();
  }

  async update(id: string, updateFlowerDto: any, sellerId?: string): Promise<Flower> {
    const query: any = { _id: id };
    if (sellerId) {
      query.seller = sellerId;
    }

    const updatedFlower = await this.flowerModel
      .findOneAndUpdate(query, updateFlowerDto, { new: true })
      .exec();
    
    if (!updatedFlower) {
      throw new NotFoundException('Gul topilmadi yoki sizda ruxsat yo\'q');
    }
    return updatedFlower;
  }

  async remove(id: string, sellerId?: string): Promise<any> {
    const query: any = { _id: id };
    if (sellerId) {
      query.seller = sellerId;
    }

    const result = await this.flowerModel.findOneAndDelete(query).exec();
    if (!result) {
      throw new NotFoundException('Gul topilmadi yoki sizda ruxsat yo\'q');
    }
    return { message: 'Gul o\'chirildi' };
  }
}
