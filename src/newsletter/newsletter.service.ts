import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Newsletter } from './schemas/newsletter.schema';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectModel(Newsletter.name) private newsletterModel: Model<Newsletter>,
  ) {}

  async subscribe(email: string): Promise<any> {
    try {
      const subscription = new this.newsletterModel({ email });
      await subscription.save();
      return { message: 'Muvaffaqiyatli obuna bo\'ldingiz!' };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Bu email allaqachon obuna bo\'lgan');
      }
      throw error;
    }
  }

  async findAll(): Promise<Newsletter[]> {
    return this.newsletterModel.find().exec();
  }

  async unsubscribe(email: string): Promise<any> {
    await this.newsletterModel.findOneAndUpdate({ email }, { isActive: false });
    return { message: 'Obuna bekor qilindi' };
  }
}
