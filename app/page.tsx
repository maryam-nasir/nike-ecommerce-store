import Image from "next/image";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { sampleProducts } from "@/lib/seed";

export default async function Home() {
  // const productList = await db.select().from(products);
  const productList = sampleProducts;

  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-white dark:bg-black">
      <main className="flex flex-col gap-8 items-center">
        <h1 className="text-3xl font-bold mb-6">Nike Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {productList.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-gray-50 dark:bg-gray-900">
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={320}
                  height={200}
                  className="object-cover w-full h-48 rounded mb-4"
                />
              )}
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-2">{product.description}</p>
              <div className="font-bold text-lg text-green-700 dark:text-green-400">${Number(product.price).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
