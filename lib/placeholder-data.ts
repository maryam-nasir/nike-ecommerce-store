export type Product = {
  id: string;
  name: string;
  description: string;
  gender: 'men' | 'women' | 'unisex';
  category: string;
  variants: Variant[];
  createdAt: Date;
};

export type Variant = {
  id: string;
  price: number;
  salePrice?: number;
  color: Color;
  size: Size;
  inStock: number;
  images: Image[];
};

export type Color = {
  name: string;
  slug: string;
  hexCode: string;
};

export type Size = {
  name: string;
  slug: string;
};

export type Image = {
  url: string;
  isPrimary: boolean;
};

export const colors: Color[] = [
  { name: 'White', slug: 'white', hexCode: '#FFFFFF' },
  { name: 'Black', slug: 'black', hexCode: '#000000' },
  { name: 'Red', slug: 'red', hexCode: '#FF0000' },
  { name: 'Green', slug: 'green', hexCode: '#008000' },
  { name: 'Blue', slug: 'blue', hexCode: '#0000FF' },
  { name: 'Yellow', slug: 'yellow', hexCode: '#FFFF00' },
  { name: 'Gray', slug: 'gray', hexCode: '#808080' },
];

export const sizes: Size[] = [
  { name: '7', slug: '7' },
  { name: '8', slug: '8' },
  { name: '9', slug: '9' },
  { name: '10', slug: '10' },
  { name: '11', slug: '11' },
  { name: '12', slug: '12' },
];

const shoeImages = [
  '/shoes/shoe-1.jpg',
  '/shoes/shoe-2.webp',
  '/shoes/shoe-3.webp',
  '/shoes/shoe-4.webp',
  '/shoes/shoe-5.avif',
  '/shoes/shoe-6.avif',
  '/shoes/shoe-7.avif',
  '/shoes/shoe-8.avif',
  '/shoes/shoe-9.avif',
  '/shoes/shoe-10.avif',
  '/shoes/shoe-11.avif',
  '/shoes/shoe-12.avif',
  '/shoes/shoe-13.avif',
  '/shoes/shoe-14.avif',
  '/shoes/shoe-15.avif',
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Nike Air Force 1 Mid \'07',
    description: 'A classic for a reason.',
    gender: 'men',
    category: 'Lifestyle',
    createdAt: new Date('2023-01-15'),
    variants: [
      {
        id: '1-1',
        price: 98.3,
        color: colors[1], // Black
        size: sizes[4], // 9
        inStock: 10,
        images: [{ url: shoeImages[0], isPrimary: true }],
      },
      {
        id: '1-2',
        price: 98.3,
        color: colors[0], // White
        size: sizes[5], // 10
        inStock: 5,
        images: [{ url: shoeImages[1], isPrimary: true }],
      },
    ],
  },
  {
    id: '2',
    name: 'Nike Court Vision Low Next Nature',
    description: 'Modern design meets classic comfort.',
    gender: 'men',
    category: 'Lifestyle',
    createdAt: new Date('2023-03-20'),
    variants: [
      {
        id: '2-1',
        price: 98.3,
        color: colors[1], // Black
        size: sizes[3], // 11
        inStock: 8,
        images: [{ url: shoeImages[2], isPrimary: true }],
      },
    ],
  },
  {
    id: '3',
    name: 'Nike Air Force 1 PLTAFORM',
    description: 'Elevated style and comfort.',
    gender: 'women',
    category: 'Lifestyle',
    createdAt: new Date('2023-05-10'),
    variants: [
      {
        id: '3-1',
        price: 98.3,
        color: colors[6], // Gray
        size: sizes[2], // 8
        inStock: 12,
        images: [{ url: shoeImages[3], isPrimary: true }],
      },
      {
        id: '3-2',
        price: 98.3,
        color: colors[0], // White
        size: sizes[3], // 8.5
        inStock: 3,
        images: [{ url: shoeImages[6], isPrimary: true }],
      },
    ],
  },
  {
    id: '4',
    name: 'Nike Dunk Low Retro',
    description: 'Iconic basketball shoe.',
    gender: 'unisex',
    category: 'Skateboarding',
    createdAt: new Date('2023-06-01'),
    variants: [
      {
        id: '4-1',
        price: 98.3,
        color: colors[5], // Yellow
        size: sizes[5], // 9.5
        inStock: 7,
        images: [{ url: shoeImages[4], isPrimary: true }],
      },
    ],
  },
  {
    id: '5',
    name: 'Nike Air Max SYSTM',
    description: 'Visible Air cushioning.',
    gender: 'men',
    category: 'Running',
    createdAt: new Date('2023-07-12'),
    variants: [
      {
        id: '5-1',
        price: 120.5,
        color: colors[0], // White
        size: sizes[1], // 10.5
        inStock: 9,
        images: [{ url: shoeImages[5], isPrimary: true }],
      },
    ],
  },
  {
    id: '6',
    name: 'Nike Dunk Low Retro SE',
    description: 'Special edition Dunk Low.',
    gender: 'men',
    category: 'Skateboarding',
    createdAt: new Date('2023-08-22'),
    variants: [
      {
        id: '6-1',
        price: 150.0,
        salePrice: 130.0,
        color: colors[0], // White
        size: sizes[0], // 11.5
        inStock: 4,
        images: [{ url: shoeImages[7], isPrimary: true }],
      },
    ],
  },
  {
    id: '7',
    name: 'Nike Air Max 90 SE',
    description: 'A classic, reimagined.',
    gender: 'unisex',
    category: 'Lifestyle',
    createdAt: new Date('2023-09-05'),
    variants: [
      {
        id: '7-1',
        price: 160.0,
        color: colors[0], // White
        size: sizes[1], // 7.5
        inStock: 11,
        images: [{ url: shoeImages[8], isPrimary: true }],
      },
    ],
  },
  {
    id: '8',
    name: 'Nike Legend Essential 3 Next Nature',
    description: 'For all your training needs.',
    gender: 'men',
    category: 'Training',
    createdAt: new Date('2023-10-18'),
    variants: [
      {
        id: '8-1',
        price: 75.0,
        color: colors[4], // Blue
        size: sizes[3], // 8.5
        inStock: 15,
        images: [{ url: shoeImages[9], isPrimary: true }],
      },
    ],
  },
  {
    id: '9',
    name: 'Nike SB Zoom Janoski OG+',
    description: 'Timeless skateboarding style.',
    gender: 'unisex',
    category: 'Skateboarding',
    createdAt: new Date('2023-11-02'),
    variants: [
      {
        id: '9-1',
        price: 95.0,
        color: colors[4], // Blue
        size: sizes[5], // 9.5
        inStock: 6,
        images: [{ url: shoeImages[10], isPrimary: true }],
      },
    ],
  },
  {
    id: '10',
    name: 'Jordan Series ES',
    description: 'Inspired by MJ\'s backyard battles.',
    gender: 'men',
    category: 'Lifestyle',
    createdAt: new Date('2023-12-01'),
    variants: [
      {
        id: '10-1',
        price: 110.0,
        color: colors[3], // Green
        size: sizes[2], // 10.5
        inStock: 2,
        images: [{ url: shoeImages[11], isPrimary: true }],
      },
    ],
  },
  {
    id: '11',
    name: 'Nike Blazer Low \'77 Jumbo',
    description: 'Oversized Swoosh design.',
    gender: 'women',
    category: 'Lifestyle',
    createdAt: new Date('2024-01-09'),
    variants: [
      {
        id: '11-1',
        price: 105.0,
        salePrice: 85.0,
        color: colors[0], // White
        size: sizes[0], // 7
        inStock: 8,
        images: [{ url: shoeImages[12], isPrimary: true }],
      },
    ],
  },
  {
    id: '12',
    name: 'Nike Air Max 1',
    description: 'The one that started it all.',
    gender: 'unisex',
    category: 'Running',
    createdAt: new Date('2024-02-14'),
    variants: [
      {
        id: '12-1',
        price: 140.0,
        color: colors[2], // Red
        size: sizes[4], // 9
        inStock: 9,
        images: [{ url: shoeImages[13], isPrimary: true }],
      },
      {
        id: '12-2',
        price: 140.0,
        color: colors[4], // Blue
        size: sizes[2], // 10
        inStock: 7,
        images: [{ url: shoeImages[14], isPrimary: true }],
      },
    ],
  },
];
