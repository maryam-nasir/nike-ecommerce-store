import { LuHeart as Heart, LuShoppingBag as ShoppingBag, LuStar as Star } from "react-icons/lu";
import { products, type Product } from "@/lib/placeholder-data";
import ProductGallery from "@/components/ProductGallery";
import SizePicker from "@/components/SizePicker";
import CollapsibleSection from "@/components/CollapsibleSection";
import Card from "@/components/Card";

type PageProps = {
  params: Promise<{ id: string }>
};

const findProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const product = findProductById(id) ?? products[0];

  const primaryVariant = product.variants[0];
  const price = primaryVariant.salePrice ?? primaryVariant.price;
  const compareAt = primaryVariant.salePrice ? primaryVariant.price : undefined;

  const alsoLike = products.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6 lg:py-10">
        <div className="lg:col-span-7">
          <ProductGallery
            title={product.name}
            variants={product.variants}
          />
        </div>

        <div className="lg:col-span-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-caption text-dark-700">
              <Star className="h-4 w-4 fill-dark-700 text-dark-700" />
              Highly Rated
            </span>
          </div>

          <h1 className="text-heading-3 text-dark-900 mb-1">{product.name}</h1>
          <p className="text-body text-dark-700 mb-4 capitalize">{product.gender}'s Shoes</p>

          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-body-medium text-dark-900">${price.toFixed(2)}</span>
            {compareAt && (
              <>
                <span className="text-body-medium line-through text-dark-500">${compareAt.toFixed(2)}</span>
                <span className="text-caption px-2 py-0.5 rounded-full bg-light-200 text-green">Extra 20% off</span>
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
            <button className="inline-flex items-center justify-center gap-2 h-12 rounded-full bg-dark-900 text-white w-full">
              <ShoppingBag className="h-5 w-5" />
              Add to Bag
            </button>
            <button className="inline-flex items-center justify-center gap-2 h-12 rounded-full border border-light-300 bg-light-100 text-dark-900 w-full">
              <Heart className="h-5 w-5" />
              Favorite
            </button>
          </div>

          <div className="mt-8 divide-y divide-light-300 border-t border-light-300">
            <CollapsibleSection title="Product Details" defaultOpen>
              <p className="text-body text-dark-700">
                The Air Max 90 stays true to its running roots with the iconic Waffle sole. Plus, stitched overlays and textured accents create the '90s look you love. Complete with romantic hues, its visible Air cushioning adds comfort to your journey.
              </p>
              <ul className="mt-3 list-disc pl-5 text-body text-dark-700 space-y-1">
                <li>Padded collar</li>
                <li>Foam midsole</li>
                <li>Shown: Dark Team Red/Platinum Tint/Pure Platinum/White</li>
                <li>Style: HM9451-600</li>
              </ul>
            </CollapsibleSection>
            <CollapsibleSection title="Shipping & Returns">
              <p className="text-body text-dark-700">Free standard shipping and 30-day returns on orders.</p>
            </CollapsibleSection>
            <CollapsibleSection title="Reviews (10)">
              <div className="flex items-center gap-1 text-dark-700">
                <Star className="h-4 w-4 fill-dark-700 text-dark-700" />
                <Star className="h-4 w-4 fill-dark-700 text-dark-700" />
                <Star className="h-4 w-4 fill-dark-700 text-dark-700" />
                <Star className="h-4 w-4 fill-dark-700 text-dark-700" />
                <Star className="h-4 w-4 text-dark-700" />
              </div>
              <p className="text-caption text-dark-700 mt-2">No reviews yet.</p>
            </CollapsibleSection>
          </div>
        </div>
      </div>

      <section className="py-10">
        <h2 className="text-heading-3 text-dark-900 mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {alsoLike.map((p) => (
            <Card
              key={p.id}
              href={`/products/${p.id}`}
              title={p.name}
              subtitle={`${p.gender.charAt(0).toUpperCase() + p.gender.slice(1)}'s Shoes`}
              price={(p.variants[0].salePrice ?? p.variants[0].price).toFixed(2)}
              compareAt={p.variants[0].salePrice ? p.variants[0].price.toFixed(2) : undefined}
              imageUrl={p.variants[0].images[0]?.url ?? "/next.svg"}
            />
          ))}
        </div>
      </section>
    </div>
  );
}


