import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InstagramMention, InstagramStatus } from './schemas/instagram.schema';
import { Flower } from '../flowers/schemas/flower.schema';

@Injectable()
export class InstagramService {
  constructor(
    @InjectModel(InstagramMention.name) private mentionModel: Model<InstagramMention>,
    @InjectModel(Flower.name) private flowerModel: Model<Flower>,
  ) {}

  async submitMention(submitDto: any, userId: string): Promise<InstagramMention> {
    const { flowerId, postUrl, screenshot } = submitDto;

    const flower = await this.flowerModel.findById(flowerId);
    if (!flower) {
      throw new NotFoundException('Gul topilmadi');
    }

    const newMention = new this.mentionModel({
      postUrl,
      screenshot,
      user: userId,
      flower: flowerId,
      seller: flower.seller, // Gulning sotuvchisi avtomatik aniqlanadi
    });

    return newMention.save();
  }

  async getSellerMentions(sellerId: string): Promise<InstagramMention[]> {
    return this.mentionModel
      .find({ seller: sellerId })
      .populate('user', 'fullName email')
      .populate('flower', 'name price')
      .sort({ createdAt: -1 })
      .exec();
  }

  async approveMention(mentionId: string, sellerId: string, status: InstagramStatus): Promise<InstagramMention> {
    const mention = await this.mentionModel.findOneAndUpdate(
      { _id: mentionId, seller: sellerId },
      { status },
      { new: true }
    );

    if (!mention) {
      throw new NotFoundException('Atmetka topilmadi yoki sizda ruxsat yo\'q');
    }

    return mention;
  }

  async getApprovedMentions(): Promise<InstagramMention[]> {
    return this.mentionModel
      .find({ status: InstagramStatus.APPROVED })
      .populate('user', 'fullName')
      .populate('flower', 'name')
      .limit(20)
      .sort({ updatedAt: -1 })
      .exec();
  }
}
