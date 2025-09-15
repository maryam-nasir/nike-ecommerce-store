import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

const bestOfAirMax = [
  {
    name: "Nike Air Force 1 Mid '07",
    category: "Men's Shoes",
    price: 98.3,
    salePrice: undefined,
    imageUrl: "/shoes/shoe-1.jpg",
    colorCount: 6,
  },
  {
    name: "Nike Court Vision Low Next Nature",
    category: "Men's Shoes",
    price: 98.3,
    salePrice: 78.3,
    imageUrl: "/shoes/shoe-2.webp",
    colorCount: 4,
  },
  {
    name: "Nike Dunk Low Retro",
    category: "Men's Shoes",
    price: 98.3,
    salePrice: undefined,
    imageUrl: "/shoes/shoe-3.webp",
    colorCount: 6,
  },
];

export default function Home() {
  return (
    <div className="font-sans bg-light-100 dark:bg-black">
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url(/hero-bg.png)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 xl:col-span-5">
              <p className="text-caption text-orange">Bold & Sporty</p>
              <h1 className="mt-3 text-heading-2 sm:text-heading-1 text-dark-900 dark:text-light-100 tracking-tight">
                Style That Moves
                <br />
                With You.
              </h1>
              <p className="mt-4 text-lead text-dark-700 max-w-md">
                Not just style. Not just comfort. Footwear that effortlessly moves with your every step.
              </p>
              <div className="mt-6">
                <Link href="#best-of" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-dark-900 text-white hover:opacity-90">
                  Find Your Shoe
                </Link>
              </div>
            </div>
            <div className="lg:col-span-6 xl:col-span-7 relative">
              <div className="pointer-events-none select-none">
                <Image src="/hero-shoe.png" alt="Featured Shoe" width={820} height={520} className="relative mx-auto lg:mx-0" priority />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best of Air Max */}
      <section id="best-of" className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        <h2 className="text-heading-3 text-dark-900">Best of Air Max</h2>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestOfAirMax.map((p) => (
            <ProductCard
              key={p.name}
              name={p.name}
              category={p.category}
              price={p.price}
              salePrice={p.salePrice}
              imageUrl={p.imageUrl}
              colorCount={p.colorCount}
            />
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-6">
        <h2 className="sr-only">Trending Now</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="relative h-[380px] sm:h-[420px] rounded-2xl overflow-hidden">
            <Image src="/trending-1.png" alt="React Presto" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute left-6 bottom-6 sm:left-8 sm:bottom-8">
              <p className="text-heading-3 text-white tracking-tight">REACT PRESTO</p>
              <p className="mt-2 text-body text-white/90 max-w-md">With React foam for the most comfortable Presto ever.</p>
              <Link href="/products" className="mt-4 inline-flex px-4 py-2 rounded-full bg-white text-dark-900 text-body-medium">Shop Now</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative h-[280px] rounded-2xl overflow-hidden">
              <Image src="/trending-2.png" alt="Summer Must-Haves: Air Max Dia" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/25" />
              <div className="absolute left-6 bottom-6 text-white text-body-medium">Summer Must-Haves: Air Max Dia</div>
            </div>
            <div className="relative h-[280px] rounded-2xl overflow-hidden">
              <Image src="/trending-3.png" alt="Air Jorden 11 Retro Low LE" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/25" />
              <div className="absolute left-6 bottom-6 text-white text-body-medium">Air Jorden 11 Retro Low LE</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <p className="text-caption text-orange">Bold & Sporty</p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <h3 className="text-heading-2 text-dark-900">NIKE REACT PRESTO BY YOU</h3>
            <p className="mt-4 text-lead text-dark-700">
              Take advantage of brand new, proprietary cushioning technology with a fresh pair of Nike react shoes.
            </p>
            <Link href="/products" className="mt-6 inline-flex px-5 py-3 rounded-full bg-dark-900 text-white text-body-medium">Shop Now</Link>
          </div>
          <div className="lg:col-span-7 relative h-[360px] sm:h-[420px]">
            <Image src="/feature.png" alt="Nike React Presto" fill className="object-contain" />
          </div>
        </div>
      </section>
    </div>
  );
}
