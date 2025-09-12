import qs from 'query-string';

type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};

type RemoveUrlQueryParams = {
  params: string;
  keysToRemove: string[];
};

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function removeKeysFromQuery({ params, keysToRemove }: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

// -------- Server/query helpers ---------

export type ParsedFilters = {
  search?: string;
  genderSlugs?: string[];
  sizeSlugs?: string[];
  colorSlugs?: string[];
  categorySlugs?: string[];
  brandSlugs?: string[];
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'latest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
};

export function parseFilterParams(searchParams: URLSearchParams | Record<string, string | string[] | undefined>): ParsedFilters {
  const get = (key: string): string | undefined => {
    if (searchParams instanceof URLSearchParams) return searchParams.get(key) ?? undefined;
    const v = searchParams[key];
    if (Array.isArray(v)) return v[0];
    return v;
  };

  const slugs = (value?: string | null): string[] | undefined =>
    value ? value.split(',').map((s) => s.trim()).filter(Boolean) : undefined;

  const price = get('price');
  let priceMin: number | undefined;
  let priceMax: number | undefined;
  if (price) {
    // Supports formats like "0-50,50-100,150". We'll compute overall min/max envelope.
    for (const token of price.split(',')) {
      if (token.includes('-')) {
        const [minStr, maxStr] = token.split('-');
        const min = Number(minStr);
        const max = Number(maxStr);
        if (!Number.isNaN(min)) priceMin = priceMin == null ? min : Math.min(priceMin, min);
        if (!Number.isNaN(max)) priceMax = priceMax == null ? max : Math.max(priceMax, max);
      } else {
        const min = Number(token);
        if (!Number.isNaN(min)) priceMin = priceMin == null ? min : Math.min(priceMin, min);
      }
    }
  }

  const sortRaw = get('sort')?.toLowerCase();
  const sortBy: ParsedFilters['sortBy'] =
    sortRaw === 'price_asc' || sortRaw === 'price_desc' || sortRaw === 'latest' ? (sortRaw as any) : 'latest';

  const page = Number(get('page') ?? '1');
  const limit = Number(get('limit') ?? '24');

  return {
    search: get('search') ?? undefined,
    genderSlugs: slugs(get('gender')),
    sizeSlugs: slugs(get('size')),
    colorSlugs: slugs(get('color')),
    categorySlugs: slugs(get('category')),
    brandSlugs: slugs(get('brand')),
    priceMin,
    priceMax,
    sortBy,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: Number.isFinite(limit) && limit > 0 ? limit : 24,
  };
}

