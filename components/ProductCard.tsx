"use client";

import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  href?: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  colorsText?: string; // e.g., "6 Colour"
  price: number;
  badge?: string; // e.g., "Best Seller" or discount text
};

export default function ProductCard({
  href = "#",
  imageUrl,
  title,
  subtitle = "Men's Shoes",
  colorsText = "6 Colour",
  price,
  badge,
}: ProductCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-lg overflow-hidden bg-light-100 dark:bg-black border border-black/5 hover:shadow transition-shadow"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-light-200">
        {badge && (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white text-green shadow-sm">
            {badge}
          </span>
        )}
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />
      </div>

      <div className="px-3 sm:px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-body-medium font-medium text-dark-900 dark:text-white line-clamp-1">
            {title}
          </h3>
          <span className="text-body-medium text-dark-900 dark:text-white/80 whitespace-nowrap">
            ${price.toFixed(2)}
          </span>
        </div>
        <p className="mt-1 text-body text-dark-700 dark:text-white/60">
          {subtitle}
        </p>
        <p className="mt-1 text-body text-dark-700 dark:text-white/60">
          {colorsText}
        </p>
      </div>
    </Link>
  );
}
