import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, Role } from '../users/schemas/user.schema';
import { Flower } from '../flowers/schemas/flower.schema';
import { Category } from '../categories/schemas/category.schema';
import { Blog } from '../blogs/schemas/blog.schema';
import { Review } from '../reviews/schemas/review.schema';
import { DailyDeal } from '../daily-deal/schemas/daily-deal.schema';
import { Order, OrderStatus } from '../orders/schemas/order.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Flower.name) private flowerModel: Model<Flower>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(DailyDeal.name) private dailyDealModel: Model<DailyDeal>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async onModuleInit() {
    const userCount = await this.userModel.countDocuments();
    if (userCount === 0) {
      console.log('🌱 No users found. Seeding large demo dataset...');
      await this.seed();
    }
  }

  async seed() {
    // 1. Clear existing data
    await Promise.all([
      this.userModel.deleteMany({}),
      this.flowerModel.deleteMany({}),
      this.categoryModel.deleteMany({}),
      this.blogModel.deleteMany({}),
      this.reviewModel.deleteMany({}),
      this.dailyDealModel.deleteMany({}),
      this.orderModel.deleteMany({}),
    ]);

    // 2. Create Users
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const admin = await this.userModel.create({
      fullName: 'Admin Adminov',
      email: 'admin@example.com',
      passwordHash,
      role: Role.ADMIN,
    });

    const seller = await this.userModel.create({
      fullName: 'Zoyidjon Nasretdinov',
      email: 'seller@example.com',
      passwordHash,
      role: Role.SELLER,
    });

    const customers: any[] = [];
    for (let i = 1; i <= 20; i++) {
      const customer = await this.userModel.create({
        fullName: `Customer ${i}`,
        email: `user${i}@example.com`,
        passwordHash,
        role: Role.USER,
      });
      customers.push(customer);
    }

    // 3. Create Categories
    const categoriesData = [
      { name: 'Roses', description: 'Timeless symbols of love and beauty, available in many colors.' },
      { name: 'Tulips', description: 'Fresh, vibrant spring flowers that bring joy to any space.' },
      { name: 'Lilies', description: 'Elegant and fragrant, perfect for sophisticated arrangements.' },
      { name: 'Sunflowers', description: 'Bright and cheerful blooms that radiate happiness.' },
      { name: 'Orchids', description: 'Exotic and long-lasting, ideal for modern interiors.' },
      { name: 'Bouquets', description: 'Hand-crafted mixed arrangements for special occasions.' },
      { name: 'Indoor Plants', description: 'Lush greenery to purify air and beautify your home.' },
      { name: 'Wedding Flowers', description: 'Bridal bouquets and ceremony decor for your big day.' },
      { name: 'Sympathy', description: 'Tasteful arrangements to express your condolences.' },
      { name: 'Gift Baskets', description: 'Curated sets with flowers, chocolates, and more.' },
    ];
    const categories = await this.categoryModel.insertMany(categoriesData);

    // 4. Create Flowers (50+ items)
    const images = [
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364',
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9',
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946',
      'https://images.unsplash.com/photo-1523348830342-d01f9ca5833e',
      'https://images.unsplash.com/photo-1519378304602-28c460a5d203',
      'https://images.unsplash.com/photo-1558249419-689973b07044',
      'https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a',
      'https://images.unsplash.com/photo-1464537356976-797750860269',
      'https://images.unsplash.com/photo-1587324438673-56c27633276d',
      'https://images.unsplash.com/photo-1516528387618-afa90b13e000',
    ];

    const flowerNames = [
      'Red Velvet Roses', 'Midnight Orchid', 'Golden Sunflowers', 'White Lily Dream', 
      'Pink Tulip Breeze', 'Mixed Spring Bouquet', 'Blue Hydrangea', 'Peace Lily Plant',
      'Crimson Peony', 'Lavender Mist', 'Desert Rose', 'Tropical Paradise',
      'Starlight Jasmine', 'Autumn Harvest', 'Winter Wonderland', 'Morning Dew',
      'Rustic Charm', 'Elegant Grace', 'Sweet Sensation', 'Pure Innocence'
    ];

    const flowersData: any[] = [];
    for (let i = 0; i < 60; i++) {
      const cat = categories[i % categories.length];
      const basePrice = 20000 + Math.floor(Math.random() * 80000);
      const name = `${flowerNames[i % flowerNames.length]} ${Math.floor(i / flowerNames.length) + 1}`;
      
      flowersData.push({
        name,
        description: `This exquisite ${name} from our ${cat.name} collection is hand-picked and arranged to ensure maximum freshness and beauty. Perfect for gifting or decorating your own space.`,
        price: basePrice,
        stock: 5 + Math.floor(Math.random() * 50),
        discountPrice: i % 4 === 0 ? Math.floor(basePrice * 0.8) : null,
        discountPercent: i % 4 === 0 ? 20 : 0,
        occasion: ['Wedding', 'Birthday', 'Anniversary', 'Thank You', 'Get Well'][i % 5],
        color: ['Red', 'Pink', 'White', 'Yellow', 'Purple', 'Blue'][i % 6],
        recipient: ['For Her', 'For Him', 'For Parents', 'For Friends'][i % 4],
        rating: 4 + Math.random(),
        reviewCount: Math.floor(Math.random() * 100),
        images: [images[i % images.length], images[(i + 1) % images.length]],
        category: cat._id,
        seller: seller._id,
        isActive: true,
        isFeatured: i < 8,
        isNewArrival: i % 10 === 0,
        isDealOfTheDay: i === 7,
        sku: `FLW-${2000 + i}`,
        tags: [cat.name, 'Fresh', 'Premium', 'Gift'],
        sizes: [
          { name: 'Standard', price: basePrice },
          { name: 'Deluxe', price: Math.floor(basePrice * 1.4) },
          { name: 'Premium', price: Math.floor(basePrice * 1.8) }
        ],
        additionalInfo: [
          { key: 'Flower Type', value: cat.name },
          { key: 'Vase Life', value: '7-10 days' },
          { key: 'Fragrance', value: i % 2 === 0 ? 'High' : 'Medium' }
        ]
      });
    }
    const flowers = await this.flowerModel.insertMany(flowersData);

    // 5. Create Daily Deal
    await this.dailyDealModel.create({
      flower: flowers[7]._id,
      dealPrice: Math.floor(flowers[7].price * 0.6),
      endDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
      isActive: true,
    });

    // 6. Create Blogs
    const blogsData = [
      {
        title: 'Top 10 Flowers for a Summer Wedding',
        content: 'Planning a summer wedding? Here are the best flowers that can withstand the heat and still look stunning...',
        excerpt: 'The ultimate guide to summer wedding florals.',
        image: images[0],
        author: admin._id,
        category: 'Wedding',
        readingTime: '6 min read',
        tags: ['Wedding', 'Summer', 'Florals']
      },
      {
        title: 'How to Extend the Life of Your Bouquets',
        content: 'Nothing is sadder than a wilting bouquet. Follow these 5 simple steps to keep your flowers fresh for up to two weeks...',
        excerpt: 'Pro tips for flower care.',
        image: images[1],
        author: admin._id,
        category: 'Care Tips',
        readingTime: '4 min read',
        tags: ['Care', 'Freshness']
      },
      {
        title: 'The Hidden Meaning Behind Flower Colors',
        content: 'Did you know that yellow roses can mean friendship or jealousy depending on the culture? Let\'s dive into the symbolism...',
        excerpt: 'What your flowers are really saying.',
        image: images[2],
        author: admin._id,
        category: 'Education',
        readingTime: '5 min read',
        tags: ['Symbolism', 'Roses']
      },
      {
        title: 'Creating a Low-Maintenance Indoor Garden',
        content: 'Want green vibes without the hard work? These 7 indoor plants are perfect for beginners...',
        excerpt: 'Best plants for black thumbs.',
        image: images[6],
        author: admin._id,
        category: 'Home Decor',
        readingTime: '7 min read',
        tags: ['Indoor Plants', 'Decor']
      },
      {
        title: 'Seasonal Flower Guide: What to Buy When',
        content: 'Buying seasonal flowers is better for your wallet and the environment. Here is what is in bloom each month...',
        excerpt: 'Shop smart and sustainably.',
        image: images[4],
        author: admin._id,
        category: 'Shopping',
        readingTime: '5 min read',
        tags: ['Seasonal', 'Guide']
      }
    ];
    await this.blogModel.insertMany(blogsData);

    // 7. Create Reviews (100+)
    const reviewsData: any[] = [];
    const reviewComments = [
      'Absolutely beautiful! They lasted much longer than I expected.',
      'The scent is heavenly. My wife loved them!',
      'Fast delivery and the packaging was very secure.',
      'Great value for the price. Highly recommend this seller.',
      'Exactly like the pictures. Very satisfied with my purchase.',
      'Perfect for the occasion. Thank you so much!',
      'Will definitely order again. The quality is top-notch.',
      'A bit pricey but worth it for the premium quality.',
      'The colors were so vibrant, they really brightened up the room.',
      'Best flower delivery service I have used so far.'
    ];

    for (let i = 0; i < 120; i++) {
      const flower = flowers[i % flowers.length];
      const user = customers[i % customers.length];
      reviewsData.push({
        flower: flower._id,
        user: user._id,
        rating: 4 + Math.floor(Math.random() * 2),
        title: i % 2 === 0 ? 'Amazing!' : 'Highly recommended',
        comment: reviewComments[i % reviewComments.length],
        images: i % 10 === 0 ? [images[i % 10]] : [],
        isVerified: true
      });
    }
    await this.reviewModel.insertMany(reviewsData);

    // 8. Create Orders (30+)
    const ordersData: any[] = [];
    for (let i = 0; i < 35; i++) {
      const user = customers[i % customers.length];
      const orderFlowers = [
        flowers[Math.floor(Math.random() * flowers.length)],
        flowers[Math.floor(Math.random() * flowers.length)]
      ];
      
      let subTotal = 0;
      const items = orderFlowers.map(f => {
        const qty = 1 + Math.floor(Math.random() * 2);
        subTotal += f.price * qty;
        return {
          flower: f._id,
          quantity: qty,
          price: f.price
        };
      });

      const totalAmount = subTotal + 15000; // subtotal + shipping

      ordersData.push({
        user: user._id,
        items,
        billingDetails: {
          firstName: user.fullName.split(' ')[0],
          lastName: user.fullName.split(' ')[1] || 'User',
          email: user.email,
          phone: `+9989012345${i.toString().padStart(2, '0')}`,
          address: `Address Street ${i + 1}`,
          city: 'Tashkent',
          zipCode: '100000'
        },
        subTotal,
        shippingCost: 15000,
        taxes: 0,
        couponDiscount: 0,
        totalAmount,
        paymentMethod: ['Paypal', 'Credit Card', 'Cash on Delivery'][i % 3],
        transactionId: `TXN-${10000 + i}`,
        status: [OrderStatus.PENDING, OrderStatus.PAID, OrderStatus.DELIVERED][i % 3],
        shippingAddress: `Tashkent, Street ${i + 1}, House ${i + 5}`,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000)
      });
    }
    await this.orderModel.insertMany(ordersData);

    return {
      message: 'Database seeded with a massive dataset successfully!',
      stats: {
        users: await this.userModel.countDocuments(),
        categories: await this.categoryModel.countDocuments(),
        flowers: await this.flowerModel.countDocuments(),
        blogs: await this.blogModel.countDocuments(),
        reviews: await this.reviewModel.countDocuments(),
        orders: await this.orderModel.countDocuments(),
      },
      credentials: {
        admin: 'admin@example.com / password123',
        seller: 'seller@example.com / password123',
        user: 'user1@example.com / password123'
      }
    };
  }
}
