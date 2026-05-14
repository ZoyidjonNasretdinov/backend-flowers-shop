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
    const { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      occasion, 
      color, 
      recipient,
      rating, 
      inStock,
      isFeatured,
      isNewArrival,
      isDealOfTheDay,
      sortBy,
      limit = 12, 
      page = 1 
    } = query;
    
    const filters: any = { isActive: true };

    if (isFeatured === 'true') {
      filters.isFeatured = true;
    }

    if (isNewArrival === 'true') {
      filters.isNewArrival = true;
    }

    if (isDealOfTheDay === 'true') {
      filters.isDealOfTheDay = true;
    }

    if (search) {
      filters.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      // Handles both single ID and array of IDs
      if (Array.isArray(category)) {
        filters.category = { $in: category };
      } else {
        filters.category = category;
      }
    }

    if (occasion) {
      const occasions = Array.isArray(occasion) ? occasion : [occasion];
      filters.occasion = { $in: occasions };
    }

    if (color) {
      const colors = Array.isArray(color) ? color : [color];
      filters.color = { $in: colors };
    }

    if (recipient) {
      const recipients = Array.isArray(recipient) ? recipient : [recipient];
      filters.recipient = { $in: recipients };
    }

    if (inStock === 'true') {
      filters.stock = { $gt: 0 };
    } else if (inStock === 'false') {
      filters.stock = 0;
    }

    if (rating) {
      filters.rating = { $gte: Number(rating) };
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    // Sorting logic
    let sortOptions: any = { createdAt: -1 };
    if (sortBy) {
      switch (sortBy) {
        case 'price_low':
          sortOptions = { price: 1 };
          break;
        case 'price_high':
          sortOptions = { price: -1 };
          break;
        case 'rating':
          sortOptions = { rating: -1 };
          break;
        case 'oldest':
          sortOptions = { createdAt: 1 };
          break;
        case 'newest':
        default:
          sortOptions = { createdAt: -1 };
          break;
      }
    }

    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.flowerModel
        .find(filters)
        .populate('category', 'name')
        .populate('seller', 'fullName email')
        .limit(Number(limit))
        .skip(skip)
        .sort(sortOptions)
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

  async findOne(id: string): Promise<any> {
    const flower = await this.flowerModel
      .findById(id)
      .populate('category', 'name')
      .populate('seller', 'fullName email')
      .exec();
    
    if (!flower) {
      throw new NotFoundException('Gul topilmadi');
    }

    const relatedProducts = await this.flowerModel
      .find({ 
        category: flower.category, 
        _id: { $ne: id },
        isActive: true 
      })
      .limit(4)
      .populate('category', 'name')
      .exec();

    return {
      product: flower,
      relatedProducts,
    };
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

  async getLandingPage(): Promise<any> {
    const [featured, newArrivals, dealOfTheDay, random] = await Promise.all([
      this.flowerModel
        .find({ isFeatured: true, isActive: true })
        .limit(4)
        .populate('category', 'name')
        .exec(),
      this.flowerModel
        .find({ isNewArrival: true, isActive: true })
        .sort({ createdAt: -1 })
        .limit(4)
        .populate('category', 'name')
        .exec(),
      this.flowerModel
        .find({ isDealOfTheDay: true, isActive: true })
        .limit(1)
        .populate('category', 'name')
        .exec(),
      this.flowerModel.aggregate([
        { $match: { isActive: true } },
        { $sample: { size: 8 } },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      ]),
    ]);

    return {
      featured,
      newArrivals,
      dealOfTheDay: dealOfTheDay[0] || null,
      random,
    };
  }
}
