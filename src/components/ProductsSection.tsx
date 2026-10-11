"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getPriceRisers,
  getPriceFallers,
} from "../lib/product-utils";
import { getProducts } from "../lib/products-api";
import type { Product } from "../types/product";
import ProductCard from "./ProductCard";

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-6 text-center text-gray-500">
        এই বিভাগে কোনো পণ্য পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard
          key={`${product.id}-${index}`}
          product={product}
        />
      ))}
    </div>
  );
}

function LoadingGrid() {
  return (
    <div
      role="status"
      aria-label="পণ্য লোড হচ্ছে"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="h-40 animate-pulse rounded-2xl bg-gray-200"
        />
      ))}
    </div>
  );
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getProducts();
      setProducts(result);
    } catch (err) {
      console.error("Products loading error:", err);
      setError("পণ্যের তথ্য লোড হয়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  const timer = setTimeout(() => {
    void loadProducts();
  }, 0);

  return () => clearTimeout(timer);
}, [loadProducts]);

  const risers = getPriceRisers(products).slice(0, 6);
  const fallers = getPriceFallers(products).slice(0, 6);

  return (
    <main className="bg-[#f7f9f6] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            আজকের বাজারদর
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            নিত্যপ্রয়োজনীয় পণ্যের দাম দেখুন এক জায়গায়
          </p>
        </header>

        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-5 text-center"
          >
            <p className="font-medium text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => void loadProducts()}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : loading ? (
          <LoadingGrid />
        ) : (
          <>
            <section className="mb-10">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-2xl" aria-hidden="true">
                  📈
                </span>
                <h2 className="text-xl font-extrabold text-gray-900">
                  আজ দাম বেড়েছে ▲
                </h2>
              </div>

              <ProductGrid products={risers} />
            </section>

            <section className="mb-10">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-2xl" aria-hidden="true">
                  📉
                </span>
                <h2 className="text-xl font-extrabold text-gray-900">
                  আজ দাম কমেছে ▼
                </h2>
              </div>

              <ProductGrid products={fallers} />
            </section>

            <section id="সব-পণ্য" className="scroll-mt-24">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-2xl" aria-hidden="true">
                  🛒
                </span>
                <h2 className="text-xl font-extrabold text-gray-900">
                  সব পণ্য
                </h2>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                  {products.length}
                </span>
              </div>

              <p className="mb-4 text-sm text-gray-600">
                নিত্যপ্রয়োজনীয় সব পণ্যের তালিকা ও দাম।
              </p>

              <ProductGrid products={products} />
            </section>
          </>
        )}
      </div>
    </main>
  );
}