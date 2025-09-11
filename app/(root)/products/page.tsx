import { products, type Product } from '@/lib/placeholder-data';
import Filters from '@/components/Filters';
import Sort from '@/components/Sort';
import ProductCard from '@/components/ProductCard';

type searchParamsObj = {
  gender?: string;
  size?: string;
  color?: string;
  price?: string;
  sort?: string;
};

const ProductsPage = async ({ searchParams }: { searchParams: Promise<searchParamsObj> }) => {
    const searchParamsObj = await searchParams;
  let filteredProducts: Product[] = [...products];
  const activeFilters: { type: string; value: string }[] = [];

  if (searchParamsObj.gender) {
    const genders = searchParamsObj.gender.split(',');
    console.log('GENDERS:', genders);
    filteredProducts = filteredProducts.filter((product) => genders.includes(product.gender));
    genders.forEach(g => activeFilters.push({ type: 'gender', value: g }));
  }

  if (searchParamsObj.size) {
    const sizes = searchParamsObj.size.split(',');
    filteredProducts = filteredProducts.filter((product) =>
      product.variants.some((variant) => sizes.includes(variant.size.slug))
    );
    sizes.forEach(s => activeFilters.push({ type: 'size', value: s }));
  }

  if (searchParamsObj.color) {
    const colors = searchParamsObj.color.split(',');
    filteredProducts = filteredProducts.filter((product) =>
      product.variants.some((variant) => colors.includes(variant.color.slug))
    );
    colors.forEach(c => activeFilters.push({ type: 'color', value: c }));
  }

  if (searchParamsObj.price) {
    const prices = searchParamsObj.price.split(',');
    // Build an array of [min, max] ranges
    const priceRanges: { min: number; max: number | null }[] = prices.map((p) => {
      if (p.includes('-')) {
        const [min, max] = p.split('-').map(Number);
        return { min, max };
      } else {
        // "150" means "over 150"
        const min = Number(p);
        return { min, max: null };
      }
    });

    filteredProducts = filteredProducts.filter((product) =>
      product.variants.some((variant) => {
        const price = variant.salePrice ?? variant.price;
        // Match if price falls in any selected range
        return priceRanges.some(({ min, max }) =>
          max === null ? price >= min : price >= min && price <= max
        );
      })
    );
    activeFilters.push({ type: 'price', value: searchParamsObj.price });
  }

  if (searchParamsObj.sort) {
    switch (searchParamsObj.sort) {
      case 'newest':
        filteredProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'price_asc':
        filteredProducts.sort(
          (a, b) =>
            (a.variants[0].salePrice ?? a.variants[0].price) -
            (b.variants[0].salePrice ?? b.variants[0].price)
        );
        break;
      case 'price_desc':
        filteredProducts.sort(
          (a, b) =>
            (b.variants[0].salePrice ?? b.variants[0].price) -
            (a.variants[0].salePrice ?? a.variants[0].price)
        );
        break;
    }
  }

  const getClearFilterUrl = (type: string, value: string) => {
    const params = new URLSearchParams();
    Object.entries(searchParamsObj).forEach(([key, val]) => {
      if (val) {
        params.set(key, val);
      }
    });

    const currentValues = params.get(type)?.split(',') ?? [];
    const newValues = currentValues.filter(v => v !== value);

    if (newValues.length > 0) {
      params.set(type, newValues.join(','));
    } else {
      params.delete(type);
    }
    return `/products?${params.toString()}`;
  }


  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">New Arrivals ({filteredProducts.length})</h1>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2">
            <p>Hide Filters</p>
          </div>
          <Sort />
        </div>
      </div>
      
      <div className="flex">
        <Filters />
        <main className="flex-1 p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map(filter => (
              <a href={getClearFilterUrl(filter.type, filter.value)} key={`${filter.type}-${filter.value}`} className="flex items-center gap-2 bg-gray-200 rounded-full px-3 py-1 text-sm">
                {filter.value}
                <span className="text-xs">✕</span>
              </a>
            ))}
            {activeFilters.length > 0 && (
               <a href="/products" className="text-sm text-gray-600 hover:underline">Clear all</a>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  category={product.category}
                  price={product.variants[0].price}
                  salePrice={product.variants[0].salePrice}
                  imageUrl={product.variants[0].images[0].url}
                  colorCount={product.variants.length}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-lg">No products found.</p>
                <p className="text-gray-500">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
