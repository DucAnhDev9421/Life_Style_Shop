const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const products = [
  {
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: 'The latest iPhone with Titanium design and A17 Pro chip.',
    price: 34990000,
    stock: 50,
    images: ['https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2023/09/13/iphone-15-pro-max-natural-titanium-pure-back-iphone-15-pro-max-natural-titanium-pure-front-2up-screen-usen.png'],
    category: 'Phone',
    status: 'active'
  },
  {
    name: 'MacBook Pro 14 M3',
    slug: 'macbook-pro-14-m3',
    description: 'Powerful laptop for professionals.',
    price: 39990000,
    stock: 20,
    images: ['https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2023/10/31/66666.png'],
    category: 'Laptop',
    status: 'active'
  },
  {
    name: 'Apple Watch Ultra 2',
    slug: 'apple-watch-ultra-2',
    description: 'The most rugged and capable Apple Watch.',
    price: 21990000,
    stock: 30,
    images: ['https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2023/09/13/watch-ultra-2.png'],
    category: 'Watch',
    status: 'active'
  },
  {
    name: 'AirPods Pro 2 USB-C',
    slug: 'airpods-pro-2-usbc',
    description: 'Magic as you’ve never heard it.',
    price: 5990000,
    stock: 100,
    images: ['https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2023/09/22/airpods-pro-2.png'],
    category: 'Accessory',
    status: 'active'
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    const user = await User.findOne();
    if (!user) {
      console.log('No user found in DB. Please register an account first!');
      process.exit(1);
    }

    // Add seller ID to each product
    const productsWithSeller = products.map(p => ({ ...p, seller: user._id }));

    await Product.deleteMany({}); // Optional: comment this if you don't want to wipe existing products
    await Product.insertMany(productsWithSeller);

    console.log('Successfully seeded 4 products!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
