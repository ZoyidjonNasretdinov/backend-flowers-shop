import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './schemas/blog.schema';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async create(createBlogDto: any, authorId: string): Promise<Blog> {
    const createdBlog = new this.blogModel({
      ...createBlogDto,
      author: authorId,
    });
    return createdBlog.save();
  }

  async findAll(): Promise<Blog[]> {
    return this.blogModel
      .find()
      .populate('author', 'fullName email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogModel
      .findById(id)
      .populate('author', 'fullName email')
      .exec();
    if (!blog) {
      throw new NotFoundException('Maqola topilmadi');
    }
    return blog;
  }

  async update(id: string, updateBlogDto: any): Promise<Blog> {
    const updatedBlog = await this.blogModel
      .findByIdAndUpdate(id, updateBlogDto, { new: true })
      .exec();
    if (!updatedBlog) {
      throw new NotFoundException('Maqola topilmadi');
    }
    return updatedBlog;
  }

  async remove(id: string): Promise<any> {
    const result = await this.blogModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Maqola topilmadi');
    }
    return { message: 'Maqola muvaffaqiyatli o\'chirildi' };
  }
}
