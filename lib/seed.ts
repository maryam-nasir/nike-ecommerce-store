import { db } from "./db";
import { products } from "./schema";

export const sampleProducts = [
  {
    id: "a4b7d0c6-6b35-4f7e-9d2f-8b9f5a9f2701",
    name: "Nike Air Max 270",
    description: "Breathable mesh upper with Max Air cushioning.",
    price: 150.0,
    imageUrl: "/shoes/shoe-1.jpg",
  },
  {
    id: "b2f1e8a3-9c41-4578-9a3a-2d8b6f4a12c3",
    name: "Nike Air Force 1",
    description: "Classic style with premium leather and Air-Sole unit.",
    price: 120.0,
    imageUrl: "/shoes/shoe-2.webp",
  },
  {
    id: "c9d3a5e2-84b7-4c0f-bf8b-3e2d7f9a4b56",
    name: "Nike Dunk Low",
    description: "Iconic basketball style with modern comfort.",
    price: 110.0,
    imageUrl: "/shoes/shoe-3.webp",
  },
  {
    id: "d1e2f3a4-b5c6-4d7e-8f9a-0b1c2d3e4f56",
    name: "Nike Pegasus 40",
    description: "Responsive running shoe for everyday training.",
    price: 130.0,
    imageUrl: "/shoes/shoe-4.webp",
  },
];

async function seed() {
  const values = sampleProducts.map(({ id, ...dbFields }) => dbFields);
  await db.insert(products).values(values);
  console.log("Seeded products table with sample Nike items.");
}

seed().then(() => process.exit(0));
