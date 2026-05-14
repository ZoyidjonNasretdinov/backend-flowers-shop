import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class SiteSettings extends Document {
  @ApiProperty({ example: 'Flowers Shop', description: 'Sayt nomi' })
  @Prop({ default: 'Flowers Shop' })
  siteName: string;

  @ApiProperty({ 
    example: [
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
    ],
    description: 'Xizmat ko\'rsatish xususiyatlari (Footer info)'
  })
  @Prop({ type: [{ title: String, description: String, icon: String }] })
  serviceFeatures: { title: string, description: string, icon: string }[];

  @ApiProperty({ example: 'contact@example.com', description: 'Aloqa emaili' })
  @Prop()
  contactEmail: string;

  @ApiProperty({ example: '+998901234567', description: 'Aloqa telefoni' })
  @Prop()
  contactPhone: string;
}

export const SiteSettingsSchema = SchemaFactory.createForClass(SiteSettings);
