import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './schemas/review.schema';
import { Flower } from '../flowers/schemas/flower.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Flower.name) private flowerModel: Model<Flower>,
  ) {}

  async create(createDto: any, userId: string): Promise<Review> {
    const review = new this.reviewModel({
      ...createDto,
      user: userId,
    });
    const savedReview = await review.save();

    // Recalculate flower rating and review count
    await this.updateFlowerRating(createDto.flower);

    return savedReview;
  }

  async findByFlower(flowerId: string, query: any): Promise<any> {
    const { limit = 10, page = 1, sortBy = 'newest' } = query;
    const skip = (page - 1) * limit;

    let sortOptions: any = { createdAt: -1 };
    if (sortBy === 'oldest') sortOptions = { createdAt: 1 };
    if (sortBy === 'rating_high') sortOptions = { rating: -1 };
    if (sortBy === 'rating_low') sortOptions = { rating: 1 };

    const [data, total] = await Promise.all([
      this.reviewModel
        .find({ flower: flowerId })
        .populate('user', 'fullName avatar')
        .limit(Number(limit))
        .skip(skip)
        .sort(sortOptions)
        .exec(),
      this.reviewModel.countDocuments({ flower: flowerId }),
    ]);

    // Get rating summary (stars breakdown)
    const summary = await this.getRatingSummary(flowerId);

    return {
      data,
      summary,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async updateFlowerRating(flowerId: string) {
    const stats = await this.reviewModel.aggregate([
      { $match: { flower: new (require('mongoose').Types.ObjectId)(flowerId) } },
      {
        $group: {
          _id: '$flower',
          avgRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await this.flowerModel.findByIdAndUpdate(flowerId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        reviewCount: stats[0].reviewCount,
      });
    }
  }

  private async getRatingSummary(flowerId: string) {
    const breakdown = await this.reviewModel.aggregate([
      { $match: { flower: new (require('mongoose').Types.ObjectId)(flowerId) } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    breakdown.forEach((item) => {
      summary[item._id] = item.count;
    });

    return summary;
  }
}
