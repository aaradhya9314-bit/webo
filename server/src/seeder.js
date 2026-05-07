import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const products = [
  {
    name: 'Aurora Wireless Headphones',
    description: 'Adaptive noise cancelling headphones with plush memory foam and 38-hour battery life.',
    price: 189,
    category: 'Electronics',
    stock: 34,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80'],
    brand: 'Auralux',
    rating: 4.8,
    numReviews: 42,
    featured: true,
    trending: true
  },
  {
    name: 'Nordic Everyday Backpack',
    description: 'Weather-resistant backpack with a padded laptop sleeve and minimalist travel pockets.',
    price: 92,
    category: 'Fashion',
    stock: 58,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80'],
    brand: 'Northline',
    rating: 4.6,
    numReviews: 31,
    featured: true
  },
  {
    name: 'Ceramic Smart Mug',
    description: 'Temperature controlled ceramic mug with app presets and a charging coaster.',
    price: 119,
    category: 'Home',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=80'],
    brand: 'Warmly',
    rating: 4.5,
    numReviews: 18,
    trending: true
  },
  {
    name: 'Studio Desk Lamp',
    description: 'Dimmable LED task lamp with wireless charging and warm-to-cool color control.',
    price: 74,
    category: 'Home',
    stock: 46,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80'],
    brand: 'Glowform',
    rating: 4.7,
    numReviews: 27,
    featured: true
  },
  {
    name: 'Pulse Fitness Watch',
    description: 'Slim fitness watch with AMOLED display, sleep insights, GPS, and 7-day battery.',
    price: 149,
    category: 'Electronics',
    stock: 39,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80'],
    brand: 'Pulse',
    rating: 4.4,
    numReviews: 55,
    trending: true
  },
  {
    name: 'Cloud Knit Sneakers',
    description: 'Lightweight breathable sneakers with recycled knit uppers and responsive foam.',
    price: 128,
    category: 'Fashion',
    stock: 64,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80'],
    brand: 'Stride',
    rating: 4.9,
    numReviews: 73,
    featured: true,
    trending: true
  },
  {
    name: 'Chef Pro Knife Set',
    description: 'Balanced stainless steel knife trio with magnetic oak storage rail.',
    price: 165,
    category: 'Kitchen',
    stock: 22,
    images: ['https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=900&q=80'],
    brand: 'Kanso',
    rating: 4.6,
    numReviews: 24
  },
  {
    name: 'Skin Reset Essentials',
    description: 'A gentle cleanser, hydrating serum, and mineral SPF routine for daily skincare.',
    price: 86,
    category: 'Beauty',
    stock: 41,
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80'],
    brand: 'Vera',
    rating: 4.3,
    numReviews: 19,
    trending: true
  }
];

const seed = async () => {
  await connectDB();
  const demoUsers = [
    { name: 'Admin User', email: 'admin@luxecart.dev', password: 'Admin123!', role: 'admin' },
    { name: 'Demo User', email: 'user@luxecart.dev', password: 'User123!', role: 'user' }
  ];

  for (const demoUser of demoUsers) {
    const existingUser = await User.findOne({ email: demoUser.email });
    if (existingUser) {
      existingUser.name = demoUser.name;
      existingUser.role = demoUser.role;
      await existingUser.save();
    } else {
      await User.create(demoUser);
    }
  }

  await Product.bulkWrite(
    products.map((product) => ({
      updateOne: {
        filter: { name: product.name },
        update: { $set: product },
        upsert: true
      }
    }))
  );

  console.log('Seed data imported');
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
