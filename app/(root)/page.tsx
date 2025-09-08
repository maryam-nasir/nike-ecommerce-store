import ProductCard from "@/components/ProductCard";
import { sampleProducts } from "@/lib/seed";

export default async function Home() {
  const productList = sampleProducts;

  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-white dark:bg-black">
      <main className="flex flex-col gap-8 items-center">
        <h1 className="text-3xl font-bold">Nike Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {productList.map((p, idx) => (
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
