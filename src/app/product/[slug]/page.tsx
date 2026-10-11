"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getProducts, getProductById } from "@/lib/products-api";
import { toNumber, formatPrice } from "@/lib/product-utils";
import type { Product } from "@/types/product";

type Market = {
  market?: string;
  division?: string;
  min?: number | string;
  max?: number | string;
};

type ProductDetails = Product & {
  yesterday?: number | string;
  pct?: number | string;
  categoryNameBn?: string;
  markets?: Market[];
};

function hasPrice(value: unknown): boolean {
  if (value === null || value === undefined || value === "") return false;

  const number = toNumber(value);
  return Number.isFinite(number) && number >= 0;
}

function bengaliNumber(value: number): string {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = String(params.slug ?? "");

  const { data: session, isPending } = useSession();

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      const callbackURL = `/product/${slug}`;

      router.replace(
        `/signin?callbackURL=${encodeURIComponent(callbackURL)}`
      );
      return;
    }

    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setError("");

      try {
        const products = await getProducts();

        let found = products.find(
          (item) =>
            String(item.slug) === slug ||
            String(item.id) === slug
        );

        if (!found && /^\d+$/.test(slug)) {
          found = (await getProductById(slug)) ?? undefined;
        }

        if (!cancelled) {
          setProduct((found as ProductDetails | undefined) ?? null);

          if (!found) {
            setError("এই পণ্যটি পাওয়া যায়নি।");
          }
        }
      } catch (err) {
        console.error("Product details error:", err);

        if (!cancelled) {
          setError("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করো।");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      cancelled = true;
    };
  }, [isPending, session, router, slug]);

  if (isPending || !session?.user || loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-4xl animate-pulse space-y-5">
          <div className="h-5 w-32 rounded bg-gray-200" />
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="mt-4 h-9 w-56 rounded bg-gray-200" />
            <div className="mt-5 h-10 w-44 rounded bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-28 rounded-xl bg-gray-200" />
            ))}
          </div>
          <div className="h-64 rounded-2xl bg-gray-200" />
          <p className="text-center text-sm text-gray-500">
            পণ্যের তথ্য লোড হচ্ছে...
          </p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-800">
            {error || "পণ্যটি পাওয়া যায়নি।"}
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-5 rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
          >
            হোম পেজে ফিরে যান
          </button>
        </div>
      </main>
    );
  }

  const today = toNumber(product.today);
  const yesterdayExists = hasPrice(product.yesterday);
  const yesterday = yesterdayExists ? toNumber(product.yesterday) : null;

  const change =
    yesterday !== null ? today - yesterday : null;

  const calculatedPct =
    yesterday !== null && yesterday !== 0
      ? ((today - yesterday) / yesterday) * 100
      : null;

  const apiPct = hasPrice(product.pct)
    ? toNumber(product.pct)
    : null;

  const pct =
    calculatedPct !== null ? calculatedPct : apiPct;

  const markets = Array.isArray(product.markets)
    ? product.markets
    : [];

  const validMarketPrices = markets.flatMap((market) => {
    const prices: number[] = [];

    if (hasPrice(market.min)) {
      prices.push(toNumber(market.min));
    }

    if (hasPrice(market.max)) {
      prices.push(toNumber(market.max));
    }

    return prices;
  });

  const minPrice =
    validMarketPrices.length > 0
      ? Math.min(...validMarketPrices)
      : null;

  const maxPrice =
    validMarketPrices.length > 0
      ? Math.max(...validMarketPrices)
      : null;

  const averagePrice =
    validMarketPrices.length > 0
      ? validMarketPrices.reduce((sum, price) => sum + price, 0) /
        validMarketPrices.length
      : null;

  const money = (value: number | null) =>
    value === null
      ? "তথ্য নেই"
      : `${formatPrice(value)} টাকা`;

  const categoryName =
    product.categoryNameBn ||
    (typeof product.category === "string"
      ? product.category
      : product.category?.name) ||
    "অন্যান্য";

  const productName =
    product.nameBn || product.name || product.title || "পণ্য";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => router.push("/")}
          className="mb-5 text-sm font-semibold text-green-700 hover:underline"
        >
          ← হোম পেজে ফিরে যান
        </button>

        {/* Product summary */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-800">
                {categoryName}
              </span>

              <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                {productName}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                {product.description ||
                  `${productName} এর বাজারদর ও বিভিন্ন বাজারের দামের তুলনা`}
              </p>

              <p className="mt-3 text-sm text-gray-500">
                একক: {product.unit || "প্রতি কেজি"}
              </p>
            </div>

            {typeof product.image === "string" && product.image ? (
              <img
                src={product.image}
                alt={productName}
                className="h-28 w-28 self-start rounded-xl object-contain sm:self-center"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-green-50 text-5xl">
                🛒
              </div>
            )}
          </div>

          <div className="mt-7 border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-500">আজকের দাম</p>
            <p className="mt-1 text-3xl font-bold text-green-700 sm:text-4xl">
              {money(today)}
              <span className="ml-2 text-base font-normal text-gray-500">
                / {product.unit || "একক"}
              </span>
            </p>
          </div>
        </section>

        {/* Price summary */}
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-bold text-gray-900">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>
              <p className="mt-2 text-2xl font-bold text-green-700">
                {money(minPrice)}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">সর্বোচ্চ দাম</p>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {money(maxPrice)}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">গড় বাজারদর</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {averagePrice === null
                  ? "তথ্য নেই"
                  : `${formatPrice(averagePrice)} টাকা`}
              </p>
            </div>
          </div>
        </section>

        {/* Yesterday and change */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">গতকালের দাম</p>
            <p className="mt-2 text-xl font-bold text-gray-900">
              {yesterday === null ? "তথ্য নেই" : money(yesterday)}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">দামের পরিবর্তন</p>
            <p
              className={`mt-2 text-xl font-bold ${
                change === null
                  ? "text-gray-600"
                  : change > 0
                    ? "text-red-600"
                    : change < 0
                      ? "text-green-700"
                      : "text-gray-600"
              }`}
            >
              {change === null
                ? "তথ্য নেই"
                : `${change > 0 ? "+" : ""}${money(change)}`}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              পরিবর্তন: {pct === null ? "তথ্য নেই" : `${bengaliNumber(pct)}%`}
            </p>
          </div>
        </section>

        {/* Market-wise prices */}
        <section className="mt-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="mb-5 text-xl font-bold text-gray-900">
            বাজারভিত্তিক আজকের দাম
          </h2>

          {markets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600">
                    <th className="p-3 font-semibold">বাজার</th>
                    <th className="p-3 font-semibold">সর্বনিম্ন দাম</th>
                    <th className="p-3 font-semibold">সর্বোচ্চ দাম</th>
                  </tr>
                </thead>
                <tbody>
                  {markets.map((market, index) => (
                    <tr
                      key={`${market.market ?? "market"}-${index}`}
                      className="border-b last:border-0"
                    >
                      <td className="p-3 font-medium text-gray-800">
                        {market.market || "বাজার"}
                        {market.division && (
                          <p className="mt-1 text-xs font-normal text-gray-500">
                            {market.division}
                          </p>
                        )}
                      </td>
                      <td className="p-3 text-green-700">
                        {hasPrice(market.min)
                          ? money(toNumber(market.min))
                          : "তথ্য নেই"}
                      </td>
                      <td className="p-3 text-gray-800">
                        {hasPrice(market.max)
                          ? money(toNumber(market.max))
                          : "তথ্য নেই"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-xl bg-gray-50 p-5 text-sm text-gray-500">
              এই পণ্যের বাজারভিত্তিক দামের তথ্য API-তে পাওয়া যায়নি।
            </p>
          )}
        </section>
      </div>
    </main>
  );
}