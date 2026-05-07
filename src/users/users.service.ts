import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-passwordHash').exec();
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
    return user;
  }

  async updateProfile(id: string, updateDto: any): Promise<User> {
    const { fullName, email, password } = updateDto;
    const updateData: any = {};

    if (fullName) updateData.fullName = fullName;
    
    if (email) {
      const existingUser = await this.userModel.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        throw new ConflictException('Bu email allaqachon band');
      }
      updateData.email = email;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(password, salt);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-passwordHash')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    return updatedUser;
  }
}
