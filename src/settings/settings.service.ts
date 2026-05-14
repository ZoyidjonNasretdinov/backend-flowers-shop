import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SiteSettings } from './schemas/settings.schema';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectModel(SiteSettings.name) private settingsModel: Model<SiteSettings>,
  ) {}

  async onModuleInit() {
    const count = await this.settingsModel.countDocuments();
    if (count === 0) {
      await this.settingsModel.create({
        siteName: 'Flowers Shop',
        serviceFeatures: [
          { 
            title: 'Free Shipping', 
            description: 'Free shipping for order above $50', 
            icon: 'shipping' 
          },
          { 
            title: 'Flexible Payment', 
            description: 'Multiple secure payment options', 
            icon: 'payment' 
          },
          { 
            title: '24x7 Support', 
            description: 'We support online all days', 
            icon: 'support' 
          }
        ]
      });
    }
  }

  async getSettings(): Promise<SiteSettings | null> {
    return this.settingsModel.findOne().exec();
  }

  async updateSettings(updateDto: any): Promise<SiteSettings | null> {
    return this.settingsModel.findOneAndUpdate({}, updateDto, { new: true, upsert: true }).exec();
  }
}
