"use client";

import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  colorCount: number;
  href?: string;
};

export default function ProductCard({
  name,
  category,
  price,
  salePrice,
  imageUrl,
  colorCount,
  href = "#",
}: ProductCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-lg overflow-hidden bg-light-100 dark:bg-black border border-black/5 hover:shadow transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-light-200">
        {salePrice && (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white text-green shadow-sm">
            Extra 20% off
          </span>
        )}
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />
      </div>

      <div className="px-3 sm:px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-body-medium font-medium text-dark-900 dark:text-white line-clamp-1">
            {name}
          </h3>
          <div className="flex flex-col items-end">
            <span
              className={`text-body-medium text-dark-900 dark:text-white/80 whitespace-nowrap ${
                salePrice && salePrice !== price ? "line-through text-gray-500" : ""
              }`}
            >
              ${price.toFixed(2)}
            </span>
            {salePrice && salePrice !== price && (
              <span className="text-body-medium text-red-500 whitespace-nowrap">
                ${salePrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <p className="mt-1 text-body text-dark-700 dark:text-white/60">
          {category}
        </p>
        <p className="mt-1 text-body text-dark-700 dark:text-white/60">
          {colorCount} Colour{colorCount > 1 ? 's' : ''}
        </p>
      </div>
    </Link>
  );
}
