'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/lib/utils/query';

const Sort = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') ?? 'newest';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'sort',
      value: e.target.value,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm font-medium">
        Sort by:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={handleSortChange}
        className="border rounded-md p-2 text-sm"
      >
        <option value="featured">Featured</option>
        <option value="newest">Newest</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="price_asc">Price: Low to High</option>
      </select>
    </div>
  );
};

export default Sort;
