import { db } from './db';
import { products } from './schema';

const sampleProducts = [
  {
    name: 'Nike Air Max 270',
    description: 'Breathable mesh upper with Max Air cushioning.',
    price: 150.00,
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/air-max-270.jpg',
  },
  {
    name: 'Nike Air Force 1',
    description: 'Classic style with premium leather and Air-Sole unit.',
    price: 120.00,
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/air-force-1.jpg',
  },
  {
    name: 'Nike Dunk Low',
    description: 'Iconic basketball style with modern comfort.',
    price: 110.00,
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/dunk-low.jpg',
  },
  {
    name: 'Nike Pegasus 40',
    description: 'Responsive running shoe for everyday training.',
    price: 130.00,
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/pegasus-40.jpg',
  },
];

async function seed() {
  await db.insert(products).values(sampleProducts);
  console.log('Seeded products table with sample Nike items.');
}

seed().then(() => process.exit(0));
