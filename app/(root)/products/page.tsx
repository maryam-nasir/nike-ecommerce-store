import Filters from '@/components/Filters';
import Sort from '@/components/Sort';
import ProductCard from '@/components/ProductCard';
import { parseFilterParams } from '@/lib/utils/query';
import { getAllProducts } from '@/lib/actions/product';

type searchParamsObj = Record<string, string | string[] | undefined>;

const ProductsPage = async ({ searchParams }: { searchParams: Promise<searchParamsObj> }) => {
  const sp = await searchParams;
  const urlParams = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (Array.isArray(v)) urlParams.set(k, v[0] as string);
    else if (typeof v === 'string') urlParams.set(k, v);
  }
  const filters = parseFilterParams(urlParams);
  const { products: list, totalCount } = await getAllProducts(filters);
  const activeFilters: { type: string; value: string }[] = [];

  if (sp.gender) String(sp.gender).split(',').forEach(g => activeFilters.push({ type: 'gender', value: g }));

  if (sp.size) String(sp.size).split(',').forEach(s => activeFilters.push({ type: 'size', value: s }));

  if (sp.color) String(sp.color).split(',').forEach(c => activeFilters.push({ type: 'color', value: c }));

  if (sp.price) activeFilters.push({ type: 'price', value: String(sp.price) });

  // Sorting handled on server

  const getClearFilterUrl = (type: string, value: string) => {
    const params = new URLSearchParams();
    Object.entries(sp).forEach(([key, val]) => {
      if (val) {
        params.set(key, String(val));
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
        <h1 className="text-2xl font-bold">New Arrivals ({totalCount})</h1>
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
            {list.length > 0 ? (
              list.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  category={product.category ?? ''}
                  price={product.minCurrentPrice}
                  salePrice={product.minSalePrice ?? undefined}
                  imageUrl={product.imageUrl ?? '/next.svg'}
                  colorCount={product.colorCount}
                  href={`/products/${product.id}`}
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
