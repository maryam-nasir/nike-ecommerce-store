import Image from "next/image";
import Link from "next/link";

type CardProps = {
  href: string;
  title: string;
  subtitle?: string;
  price: string;
  compareAt?: string;
  imageUrl: string;
};

export default function Card({ href, title, subtitle, price, compareAt, imageUrl }: CardProps) {
  return (
    <Link href={href} className="group block rounded-lg overflow-hidden border border-black/5 bg-light-100">
      <div className="relative aspect-square bg-light-200">
        <Image src={imageUrl} alt={title} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className="px-3 sm:px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-body-medium text-dark-900 line-clamp-1">{title}</h3>
          <div className="flex flex-col items-end">
            {compareAt && (
              <span className="text-body-medium line-through text-dark-500">${compareAt}</span>
            )}
            <span className="text-body-medium text-dark-900">${price}</span>
          </div>
        </div>
        {subtitle && <p className="mt-1 text-body text-dark-700">{subtitle}</p>}
      </div>
    </Link>
  );
}


