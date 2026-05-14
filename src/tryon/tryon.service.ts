import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tryon, TryonStatus } from './schemas/tryon.schema';
import Replicate from 'replicate';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TryonService {
  private replicate: Replicate;

  constructor(
    @InjectModel(Tryon.name) private tryonModel: Model<Tryon>,
    private configService: ConfigService,
  ) {
    this.replicate = new Replicate({
      auth: this.configService.get<string>('REPLICATE_API_TOKEN'),
    });
  }

  async create(userId: string, body: { humanImage: string; garmentImage: string }) {
    const { humanImage, garmentImage } = body;

    const newTryon = new this.tryonModel({
      user: userId,
      humanImage,
      garmentImage,
      status: TryonStatus.PENDING,
    });

    await newTryon.save();

    try {
      const prediction = await this.replicate.predictions.create({
        version: "c8c35b64a511c3376110a92458459503fa64ca051e548285a2306f594bf6943e", // cuuupid/idm-vton
        input: {
          crop: true,
          seed: 42,
          steps: 30,
          category: "upper_body",
          force_dc: false,
          human_img: humanImage,
          garm_img: garmentImage,
          garment_des: "fashion garment",
          guidance_scale: 2
        }
      });

      newTryon.predictionId = prediction.id;
      newTryon.status = TryonStatus.PROCESSING;
      await newTryon.save();

      return newTryon;
    } catch (error) {
      newTryon.status = TryonStatus.FAILED;
      await newTryon.save();
      throw new BadRequestException('AI xizmatida xatolik: ' + error.message);
    }
  }

  async checkStatus(id: string) {
    const tryon = await this.tryonModel.findById(id);
    if (!tryon) throw new BadRequestException('Topilmadi');

    if (tryon.status === TryonStatus.COMPLETED || tryon.status === TryonStatus.FAILED) {
      return tryon;
    }

    const prediction = await this.replicate.predictions.get(tryon.predictionId);
    
    if (prediction.status === 'succeeded') {
      tryon.resultImage = prediction.output as string;
      tryon.status = TryonStatus.COMPLETED;
    } else if (prediction.status === 'failed') {
      tryon.status = TryonStatus.FAILED;
    }

    await tryon.save();
    return tryon;
  }

  async findAll(userId: string) {
    return this.tryonModel.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }
}
