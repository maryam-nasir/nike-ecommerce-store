"use server";

import { db } from "@/lib/db";
import {
  products,
  productVariants,
  categories,
  brands,
  genders,
  // Filters
  colors,
  sizes,
  reviews as reviewsTable,
  users,
} from "@/lib/db/schema";
import { sql, and, or, ilike, inArray, desc, eq } from "drizzle-orm";

export type GetAllProductsParams = {
  search?: string;
  genderSlugs?: string[];
  sizeSlugs?: string[];
  colorSlugs?: string[];
  categorySlugs?: string[];
  brandSlugs?: string[];
  priceMin?: number;
  priceMax?: number;
  sortBy?: "latest" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
};

export type ProductListItem = {
  id: string;
  name: string;
  category: string | null;
  brand: string | null;
  createdAt: Date;
  minCurrentPrice: number;
  minOriginalPrice: number;
  minSalePrice: number | null;
  maxCurrentPrice: number;
  colorCount: number;
  imageUrl: string | null;
};

export async function getAllProducts(params: GetAllProductsParams): Promise<{
  products: ProductListItem[];
  totalCount: number;
}> {
  const {
    search,
    genderSlugs,
    sizeSlugs,
    colorSlugs,
    categorySlugs,
    brandSlugs,
    priceMin,
    priceMax,
    sortBy = "latest",
    page = 1,
    limit = 24,
  } = params;

  const safePage = Number.isFinite(page) && page! > 0 ? page! : 1;
  const safeLimit = Math.min(Math.max(Number(limit) || 24, 1), 60);
  const offset = (safePage - 1) * safeLimit;

  const hasColorFilter = Array.isArray(colorSlugs) && colorSlugs.length > 0;

  const whereParts = [eq(products.isPublished, true)] as any[];

  if (search && search.trim().length > 0) {
    whereParts.push(
      or(ilike(products.name, `%${search}%`), ilike(products.description, `%${search}%`))
    );
  }

  if (Array.isArray(categorySlugs) && categorySlugs.length > 0) {
    whereParts.push(inArray(categories.slug, categorySlugs));
  }
  if (Array.isArray(brandSlugs) && brandSlugs.length > 0) {
    whereParts.push(inArray(brands.slug, brandSlugs));
  }
  if (Array.isArray(genderSlugs) && genderSlugs.length > 0) {
    whereParts.push(inArray(genders.slug, genderSlugs));
  }
  if (Array.isArray(sizeSlugs) && sizeSlugs.length > 0) {
    whereParts.push(inArray(sizes.slug, sizeSlugs));
  }
  if (Array.isArray(colorSlugs) && colorSlugs.length > 0) {
    whereParts.push(inArray(colors.slug, colorSlugs));
  }
  if (typeof priceMin === "number") {
    whereParts.push(
      sql`exists (
        select 1 from product_variants pv
        where pv.product_id = ${products.id}
          and coalesce(pv.sale_price, pv.price) >= ${priceMin}
      )`
    );
  }
  if (typeof priceMax === "number") {
    whereParts.push(
      sql`exists (
        select 1 from product_variants pv
        where pv.product_id = ${products.id}
          and coalesce(pv.sale_price, pv.price) <= ${priceMax}
      )`
    );
  }

  const imageUrlSelect = hasColorFilter
    ? sql<string>`coalesce(
        (
          select pi.url from product_images pi
          where pi.product_id = ${products.id}
            and pi.variant_id in (
              select pv2.id from product_variants pv2
              join colors c2 on c2.id = pv2.color_id
              where pv2.product_id = ${products.id}
                and c2.slug = any(string_to_array(${(colorSlugs || []).join(',')}, ','))
            )
          order by pi.is_primary desc, pi.sort_order asc
          limit 1
        ),
        (
          select pi2.url from product_images pi2
          where pi2.product_id = ${products.id} and pi2.variant_id is null
          order by pi2.is_primary desc, pi2.sort_order asc
          limit 1
        )
      )`.as("image_url")
    : sql<string>`coalesce(
        (
          select pi.url from product_images pi
          where pi.product_id = ${products.id} and pi.variant_id is null
          order by pi.is_primary desc, pi.sort_order asc
          limit 1
        ),
        (
          select pi2.url from product_images pi2
          where pi2.product_id = ${products.id}
          order by pi2.is_primary desc, pi2.sort_order asc
          limit 1
        )
      )`.as("image_url");

  const minOriginal = sql<string>`min(${productVariants.price})`.as("min_original_price");
  const minCurrent = sql<string>`min(coalesce(${productVariants.salePrice}, ${productVariants.price}))`.as(
    "min_current_price"
  );
  const minSale = sql<string>`min(${productVariants.salePrice})`.as("min_sale_price");
  const maxCurrent = sql<string>`max(coalesce(${productVariants.salePrice}, ${productVariants.price}))`.as(
    "max_current_price"
  );
  const colorCount = sql<number>`count(distinct ${productVariants.colorId})`.as("color_count");

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      category: categories.name,
      brand: brands.name,
      createdAt: products.createdAt,
      minCurrentPrice: minCurrent,
      minOriginalPrice: minOriginal,
      minSalePrice: minSale,
      maxCurrentPrice: maxCurrent,
      colorCount,
      imageUrl: imageUrlSelect,
    })
    .from(products)
    .innerJoin(productVariants, eq(productVariants.productId, products.id))
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .leftJoin(brands, eq(brands.id, products.brandId))
    .leftJoin(genders, eq(genders.id, products.genderId))
    .leftJoin(colors, eq(colors.id, productVariants.colorId))
    .leftJoin(sizes, eq(sizes.id, productVariants.sizeId))
    .where(and(...whereParts))
    .groupBy(products.id, products.name, products.createdAt, categories.name, brands.name)
    .orderBy(
      sortBy === "price_asc"
        ? sql`min(coalesce(${productVariants.salePrice}, ${productVariants.price})) asc`
        : sortBy === "price_desc"
        ? sql`min(coalesce(${productVariants.salePrice}, ${productVariants.price})) desc`
        : desc(products.createdAt)
    )
    .limit(safeLimit)
    .offset(offset);

  const parsed: ProductListItem[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category ?? null,
    brand: r.brand ?? null,
    createdAt: new Date(r.createdAt),
    minCurrentPrice: Number(r.minCurrentPrice ?? 0),
    minOriginalPrice: Number(r.minOriginalPrice ?? 0),
    minSalePrice: r.minSalePrice != null ? Number(r.minSalePrice) : null,
    maxCurrentPrice: Number(r.maxCurrentPrice ?? 0),
    colorCount: Number(r.colorCount ?? 0),
    imageUrl: r.imageUrl ?? null,
  }));

  const [{ count }] = await db
    .select({ count: sql<number>`count(distinct ${products.id})` })
    .from(products)
    .innerJoin(productVariants, eq(productVariants.productId, products.id))
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .leftJoin(brands, eq(brands.id, products.brandId))
    .leftJoin(genders, eq(genders.id, products.genderId))
    .leftJoin(colors, eq(colors.id, productVariants.colorId))
    .leftJoin(sizes, eq(sizes.id, productVariants.sizeId))
    .where(and(...whereParts));

  return { products: parsed, totalCount: Number(count) };
}

export type GetProductDetails = {
  id: string;
  name: string;
  description: string;
  category: { id: string; name: string; slug: string } | null;
  brand: { id: string; name: string; slug: string } | null;
  gender: { id: string; label: string; slug: string } | null;
  images: { id: string; url: string; isPrimary: boolean; sortOrder: number; variantId: string | null }[];
  variants: {
    id: string;
    sku: string;
    price: number;
    salePrice: number | null;
    inStock: number;
    color: { id: string; name: string; slug: string; hexCode: string };
    size: { id: string; name: string; slug: string; sortOrder: number };
  }[];
  createdAt: Date;
  updatedAt: Date;
};

export async function getProduct(productId: string): Promise<GetProductDetails | null> {
  // Single query joining all relevant tables, then reduce rows into a structured object
  const rows = await db.execute(sql`
    select 
      p.id as p_id,
      p.name as p_name,
      p.description as p_description,
      p.created_at as p_created_at,
      p.updated_at as p_updated_at,
      c.id as c_id, c.name as c_name, c.slug as c_slug,
      b.id as b_id, b.name as b_name, b.slug as b_slug,
      g.id as g_id, g.label as g_label, g.slug as g_slug,
      v.id as v_id, v.sku as v_sku, v.price as v_price, v.sale_price as v_sale_price, v.in_stock as v_in_stock,
      col.id as col_id, col.name as col_name, col.slug as col_slug, col.hex_code as col_hex,
      s.id as s_id, s.name as s_name, s.slug as s_slug, s.sort_order as s_order,
      pi.id as i_id, pi.url as i_url, pi.is_primary as i_primary, pi.sort_order as i_order, pi.variant_id as i_variant_id
    from products p
    left join categories c on c.id = p.category_id
    left join brands b on b.id = p.brand_id
    left join genders g on g.id = p.gender_id
    left join product_variants v on v.product_id = p.id
    left join colors col on col.id = v.color_id
    left join sizes s on s.id = v.size_id
    left join product_images pi on pi.product_id = p.id
    where p.id = ${productId} and p.is_published = true
  `);

  if (rows.rows.length === 0) return null;

  const first = rows.rows[0] as any;
  const product: GetProductDetails = {
    id: first.p_id,
    name: first.p_name,
    description: first.p_description,
    createdAt: new Date(first.p_created_at),
    updatedAt: new Date(first.p_updated_at),
    category: first.c_id
      ? { id: first.c_id, name: first.c_name, slug: first.c_slug }
      : null,
    brand: first.b_id ? { id: first.b_id, name: first.b_name, slug: first.b_slug } : null,
    gender: first.g_id ? { id: first.g_id, label: first.g_label, slug: first.g_slug } : null,
    images: [],
    variants: [],
  };

  const imageMap = new Map<string, GetProductDetails["images"][number]>();
  const variantMap = new Map<string, GetProductDetails["variants"][number]>();

  for (const row of rows.rows as any[]) {
    if (row.i_id && !imageMap.has(row.i_id)) {
      imageMap.set(row.i_id, {
        id: row.i_id,
        url: row.i_url,
        isPrimary: row.i_primary,
        sortOrder: row.i_order,
        variantId: row.i_variant_id ?? null,
      });
    }

    if (row.v_id && !variantMap.has(row.v_id)) {
      variantMap.set(row.v_id, {
        id: row.v_id,
        sku: row.v_sku,
        price: Number(row.v_price),
        salePrice: row.v_sale_price != null ? Number(row.v_sale_price) : null,
        inStock: Number(row.v_in_stock ?? 0),
        color: {
          id: row.col_id,
          name: row.col_name,
          slug: row.col_slug,
          hexCode: row.col_hex,
        },
        size: {
          id: row.s_id,
          name: row.s_name,
          slug: row.s_slug,
          sortOrder: Number(row.s_order ?? 0),
        },
      });
    }
  }

  product.images = Array.from(imageMap.values()).sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
    return a.sortOrder - b.sortOrder;
  });
  product.variants = Array.from(variantMap.values());

  return product;
}

export type Review = {
  id: string;
  author: string;
  rating: number;
  title?: string;
  content: string;
  createdAt: string;
};

export async function getProductReviews(productId: string): Promise<Review[]> {
  // Reviews joined with users; schema has no approval flag, so we return all existing reviews
  const rows = await db
    .select({
      id: reviewsTable.id,
      rating: reviewsTable.rating,
      comment: reviewsTable.comment,
      createdAt: reviewsTable.createdAt,
      authorName: users.name,
      authorEmail: users.email,
    })
    .from(reviewsTable)
    .leftJoin(users, eq(users.id, reviewsTable.userId))
    .where(eq(reviewsTable.productId, productId))
    .orderBy(desc(reviewsTable.createdAt));

  if (rows.length === 0) {
    // Dummy fallback when no reviews exist in DB
    return [];
  }

  return rows.map((r) => ({
    id: r.id,
    author: r.authorName ?? r.authorEmail ?? "Anonymous",
    rating: r.rating,
    title: undefined,
    content: r.comment ?? "",
    createdAt: new Date(r.createdAt).toISOString(),
  }));
}

export type RecommendedProduct = {
  id: string;
  title: string;
  price: number;
  compareAt?: number;
  imageUrl: string;
};

export async function getRecommendedProducts(productId: string, limit: number = 6): Promise<RecommendedProduct[]> {
  // Find the anchor product's attributes
  const [anchor] = await db
    .select({
      id: products.id,
      categoryId: products.categoryId,
      brandId: products.brandId,
      genderId: products.genderId,
    })
    .from(products)
    .where(eq(products.id, productId));

  if (!anchor) return [];

  // Select related products by category/brand/gender with a representative image and price
  const rows = await db
    .select({
      id: products.id,
      title: products.name,
      // price selection: min current price across variants
      price: sql<string>`min(coalesce(${productVariants.salePrice}, ${productVariants.price}))`.as("price"),
      compareAt: sql<string>`nullif(min(${productVariants.price}), min(coalesce(${productVariants.salePrice}, ${productVariants.price})))`.as(
        "compare_at"
      ),
      imageUrl: sql<string>`coalesce(
        (
          select pi.url from product_images pi
          where pi.product_id = ${products.id} and pi.variant_id is null
          order by pi.is_primary desc, pi.sort_order asc
          limit 1
        ),
        (
          select pi2.url from product_images pi2
          where pi2.product_id = ${products.id}
          order by pi2.is_primary desc, pi2.sort_order asc
          limit 1
        )
      )`.as("image_url"),
    })
    .from(products)
    .innerJoin(productVariants, eq(productVariants.productId, products.id))
    .where(
      and(
        eq(products.isPublished, true),
        sql`(${products.id} <> ${productId})`,
        sql`(
          ${products.categoryId} = ${anchor.categoryId}
          or ${products.brandId} = ${anchor.brandId}
          or ${products.genderId} = ${anchor.genderId}
        )`
      )
    )
    .groupBy(products.id, products.name)
    .orderBy(desc(products.createdAt))
    .limit(Math.min(Math.max(Number(limit) || 6, 1), 12));

  return rows
    .map((r) => ({
      id: r.id,
      title: r.title,
      price: Number(r.price ?? 0),
      compareAt: r.compareAt != null ? Number(r.compareAt) : undefined,
      imageUrl: r.imageUrl ?? "",
    }))
    .filter((p) => Boolean(p.imageUrl));
}


