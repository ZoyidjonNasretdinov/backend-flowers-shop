import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AIRequest } from './schemas/generator.schema';
import Replicate from 'replicate';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeneratorService {
  private replicate: Replicate;

  constructor(
    @InjectModel(AIRequest.name) private aiRequestModel: Model<AIRequest>,
    private configService: ConfigService,
  ) {
    this.replicate = new Replicate({
      auth: this.configService.get<string>('REPLICATE_API_TOKEN'),
    });
  }

  async generate(userId: string, body: any) {
    const { flowerType, color, occasion, extraElements } = body;

    // Promptni shakllantirish
    const extras = extraElements && extraElements.length > 0 
      ? `with ${extraElements.join(', ')}` 
      : '';
    
    const prompt = `A professional, high-quality studio photography of a beautiful flower bouquet containing ${flowerType}, color palette is ${color}, intended for ${occasion} theme, ${extras}. Cinematic lighting, 8k resolution, elegant composition, blurred background.`;

    const newRequest = new this.aiRequestModel({
      user: userId,
      flowerType,
      color,
      occasion,
      extraElements,
      finalPrompt: prompt,
    });

    await newRequest.save();

    try {
      // Replicate orqali rasm generatsiya qilish (Flux modeli)
      const output = await this.replicate.run(
        "black-forest-labs/flux-schnell",
        {
          input: {
            prompt: prompt,
            num_outputs: 1,
            aspect_ratio: "1:1",
            output_format: "webp",
            output_quality: 90
          }
        }
      );

      const imageUrl = (output as string[])[0];
      newRequest.imageUrl = imageUrl;
      await newRequest.save();

      return newRequest;
    } catch (error) {
      throw new BadRequestException('Rasm generatsiya qilishda xatolik: ' + error.message);
    }
  }

  async getMyGenerations(userId: string) {
    return this.aiRequestModel.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }

  async getElements() {
    return {
      flowerTypes: [
        'Roses', 'Tulips', 'Lilies', 'Orchids', 
        'Sunflowers', 'Peonies', 'Daisies', 'Hydrangeas'
      ],
      colors: [
        'Red', 'Pink', 'White', 'Yellow', 
        'Purple', 'Mixed', 'Blue', 'Orange', 'Cream'
      ],
      occasions: [
        'Wedding', 'Birthday', 'Anniversary', 
        'Thank You', 'Graduation', 'Get Well Soon', 
        'Romantic', 'New Baby', 'Sympathy'
      ],
      extraElements: [
        'Ribbons', 'Greenery', 'Wrapping Paper', 
        'Glitter', 'Pearl Decorations', 'Butterflies', 
        'Gift Card', 'Box Packaging'
      ]
    };
  }
}
