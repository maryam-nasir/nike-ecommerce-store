import ProductCard from "@/components/ProductCard";
import { getCurrentUser } from "@/lib/auth/actions";

 const products = [
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

export default async function Home() {
  const user = await getCurrentUser();
  console.log('USER:', user);

  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-white dark:bg-black">
      <main className="flex flex-col gap-8 items-center">
        <h1 className="text-3xl font-bold">Nike Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {products.map((p, idx) => (
            <ProductCard
              key={p.id ?? idx}
              imageUrl={p.imageUrl}
              title={p.name}
              subtitle={"Men's Shoes"}
              colorsText={idx % 2 === 0 ? "6 Colour" : "4 Colour"}
              price={Number(p.price)}
              badge={
                idx === 0
                  ? "Best Seller"
                  : idx === 1
                  ? "Extra 20% off"
                  : idx === 2
                  ? "Extra 10% off"
                  : undefined
              }
            />
          ))}
        </div>
      </main>
    </div>
  );
}
