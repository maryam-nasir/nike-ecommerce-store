import { Suspense } from "react";
import { LuHeart as Heart, LuShoppingBag as ShoppingBag, LuStar as Star } from "react-icons/lu";
import ProductGallery from "@/components/ProductGallery";
import SizePicker from "@/components/SizePicker";
import CollapsibleSection from "@/components/CollapsibleSection";
import Card from "@/components/Card";
import { getProduct, getProductReviews, getRecommendedProducts } from "@/lib/actions/product";
import type { GetProductDetails } from "@/lib/actions/product";
import type { Variant as GalleryVariant, Image as GalleryImage, Variant } from "@/lib/placeholder-data";
import AddToBagButton from "@/components/AddToBagButton";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>
};

function formatMoney(n: number): string {
  return n.toFixed(2);
}

function mapVariantsForGallery(product: GetProductDetails): GalleryVariant[] {
  return product.variants.map((v: GetProductDetails["variants"][number]) => {
    const variantImages = product.images.filter((i: GetProductDetails["images"][number]) => i.variantId === v.id);
    const fallbackImages = product.images.filter((i: GetProductDetails["images"][number]) => i.variantId === null);
    const images: GalleryImage[] = (variantImages.length > 0 ? variantImages : fallbackImages)
      .filter((i: GetProductDetails["images"][number]) => Boolean(i.url))
      .map((i: GetProductDetails["images"][number]) => ({ url: i.url, isPrimary: i.isPrimary }));
    return {
      id: v.id,
      price: v.salePrice ?? v.price,
      salePrice: v.salePrice ?? undefined,
      color: { name: v.color.name, slug: v.color.slug, hexCode: v.color.hexCode },
      size: { name: v.size.name, slug: v.size.slug },
      inStock: v.inStock,
      images,
    } as GalleryVariant;
  });
}

async function ReviewsSection({ productId }: { productId: string }) {
  const reviews = await getProductReviews(productId);
  const firstTen = reviews.slice(0, 10);
  return (
    <CollapsibleSection title={`Reviews (${firstTen.length})`}>
      {firstTen.length === 0 ? (
        <p className="text-caption text-dark-700">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {firstTen.map((r) => (
            <details key={r.id} className="rounded-md border border-light-300 bg-light-100 p-3">
              <summary className="cursor-pointer list-none">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1 text-dark-700">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-dark-700 text-dark-700" : "text-dark-700"}`} />
                    ))}
                  </div>
                  <span className="text-caption text-dark-700">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-1 text-body-medium text-dark-900">{r.author}</p>
              </summary>
              <p className="mt-2 text-body text-dark-700">{r.content}</p>
            </details>
          ))}
        </div>
      )}
    </CollapsibleSection>
  );
}

async function AlsoLikeSection({ productId }: { productId: string }) {
  const items = await getRecommendedProducts(productId, 6);
  if (!items || items.length === 0) return null;
  return (
    <section className="py-10">
      <h2 className="text-heading-3 text-dark-900 mb-6">You Might Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <Card
            key={p.id}
            href={`/products/${p.id}`}
            title={p.title}
            subtitle={undefined}
            price={formatMoney(p.price)}
            compareAt={p.compareAt != null ? formatMoney(p.compareAt) : undefined}
            imageUrl={p.imageUrl}
          />
        ))}
      </div>
    </section>
  );
}

function SectionSkeleton({ title, rows = 3 }: { title: string; rows?: number }) {
  return (
    <section className="py-10 animate-pulse">
      <div className="h-7 w-56 rounded bg-light-200 mb-6" aria-label={title}></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="rounded-lg overflow-hidden border border-black/5 bg-light-100">
            <div className="aspect-square bg-light-200" />
            <div className="p-4">
              <div className="h-5 w-2/3 bg-light-200 rounded mb-2" />
              <div className="h-4 w-1/3 bg-light-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-heading-3 text-dark-900 mb-2">Product not found</h1>
          <p className="text-body text-dark-700 mb-6">The product you’re looking for doesn’t exist or may have been removed.</p>
          <Link href="/products" className="inline-flex h-11 items-center justify-center rounded-full bg-dark-900 px-5 text-white">Back to Products</Link>
        </div>
      </div>
    );
  }

  const galleryVariants = mapVariantsForGallery(product).filter((v: GalleryVariant) => v.images.length > 0);
  const hasGallery = galleryVariants.length > 0;

  // Price range (display min current and compare min original if on sale)
  const prices = product.variants.map(v => ({ current: v.salePrice ?? v.price, original: v.price }));
  const minCurrent = Math.min(...prices.map(p => p.current));
  const minOriginal = Math.min(...prices.map(p => p.original));
  const compareAt = minOriginal > minCurrent ? minOriginal : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6 lg:py-10">
        <div className="lg:col-span-7">
          {hasGallery && (
            <ProductGallery title={product.name} variants={galleryVariants as Variant[]} />
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-caption text-dark-700">
              <Star className="h-4 w-4 fill-dark-700 text-dark-700" />
              Highly Rated
            </span>
          </div>

          <h1 className="text-heading-3 text-dark-900 mb-1">{product.name}</h1>
          <p className="text-body text-dark-700 mb-4 capitalize">{product.gender?.label ?? "Unisex"}'s Shoes</p>

          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-body-medium text-dark-900">${formatMoney(minCurrent)}</span>
            {compareAt && (
              <>
                <span className="text-body-medium line-through text-dark-500">${formatMoney(compareAt)}</span>
                <span className="text-caption px-2 py-0.5 rounded-full bg-light-200 text-green">Limited offer</span>
              </>
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-body-medium text-dark-900">Select Size</p>
              <button className="text-caption text-dark-700">Size Guide</button>
            </div>
            <SizePicker />
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <AddToBagButton variantId={product.variants[0]?.id} />
            <button className="inline-flex items-center justify-center gap-2 h-12 rounded-full border border-light-300 bg-light-100 text-dark-900 w-full">
              <Heart className="h-5 w-5" />
              Favorite
            </button>
          </div>

          <div className="mt-8 divide-y divide-light-300 border-t border-light-300">
            <CollapsibleSection title="Product Details" defaultOpen>
              <p className="text-body text-dark-700">{product.description}</p>
            </CollapsibleSection>
            <CollapsibleSection title="Shipping & Returns">
              <p className="text-body text-dark-700">Free standard shipping and 30-day returns on orders.</p>
            </CollapsibleSection>
            <Suspense fallback={<SectionSkeleton title="Reviews" rows={1} />}>
              <ReviewsSection productId={product.id} />
            </Suspense>
          </div>
        </div>
      </div>

      <Suspense fallback={<SectionSkeleton title="You Might Also Like" rows={3} />}>
        <AlsoLikeSection productId={product.id} />
      </Suspense>
    </div>
  );
}