"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";
import { getProductPrice } from "@/lib/product-utils";

type Props = {
  products: Product[];
};

type SortOption = "default" | "asc" | "desc";

function getNumericPrice(product: Product): number {
  const value = getProductPrice(product);

  const normalized = String(value ?? "")
    .replace(/[০-৯]/g, (digit) =>
      String("০১২৩৪৫৬৭৮৯".indexOf(digit))
    )
    .replace(/,/g, "")
    .replace(/[^\d.-]/g, "");

  const price = Number(normalized);

  return Number.isFinite(price) ? price : 0;
}

export default function CategoryProducts({ products }: Props) {
  const [sort, setSort] = useState<SortOption>("default");

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sort === "asc") {
      result.sort(
        (a, b) => getNumericPrice(a) - getNumericPrice(b)
      );
    } else if (sort === "desc") {
      result.sort(
        (a, b) => getNumericPrice(b) - getNumericPrice(a)
      );
    }

    return result;
  }, [products, sort]);

  if (products.length === 0) {
    return (
      <section className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-12 text-center">
        <span className="text-5xl">🛒</span>

        <h2 className="mt-4 text-xl font-bold text-gray-900">
          এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          অন্য ক্যাটাগরি থেকে পণ্য দেখো।
        </p>

        <Link
          href="/"
          className="mt-5 rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
        >
          হোম পেজে ফিরে যাও
        </Link>
      </section>
    );
  }

  return (
    <section aria-label="ক্যাটাগরির পণ্য">
      {/* Product Count and Sort Control */}
      <div className="mb-5 flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            মোট পণ্য: {products.length.toLocaleString("bn-BD")}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            দাম অনুযায়ী পণ্য সাজিয়ে নাও।
          </p>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 sm:flex-row sm:items-center">
          <span>সাজান:</span>

          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as SortOption)
            }
            className="min-w-56 rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
          >
            <option value="default">ডিফল্ট</option>
            <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
          </select>
        </label>
      </div>

      {/* Responsive Product Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedProducts.map((product) => (
          <ProductCard
            key={String(product.id ?? product.slug)}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}