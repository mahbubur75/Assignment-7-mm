"use client";

import { useRouter } from "next/navigation";
import { useSession } from "../lib/auth-client";
import type { Product } from "../types/product";
import {
  formatPrice,
  getProductName,
  getProductEmoji,
  getProductPrice,
  getChangePercent,
} from "../lib/product-utils";

type Market = {
  market?: string;
  name?: string;
  min?: number | string;
  max?: number | string;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const change = Number(getChangePercent(product)) || 0;
  const price = Number(getProductPrice(product)) || 0;

  const productData = product as Product & {
    markets?: Market[];
    unit?: string;
  };

  const changeColor =
    change > 0
      ? "bg-green-50 text-green-700"
      : change < 0
        ? "bg-red-50 text-red-600"
        : "bg-gray-100 text-gray-500";

  function handleClick() {
    if (isPending) return;

    const slug = String(product.slug || product.id);

    if (!session?.user) {
      const callbackURL = `/product/${slug}`;

      router.push(
        `/signin?callbackURL=${encodeURIComponent(callbackURL)}`,
      );

      return;
    }

    router.push(`/product/${slug}`);
  }

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`${getProductName(product)} এর বিস্তারিত দেখুন`}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleClick();
        }
      }}
      className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-2xl">
          {getProductEmoji(product)}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-800">
            {getProductName(product)}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            আজকের দাম
          </p>

          <p className="text-lg font-extrabold text-gray-900">
            ৳{formatPrice(price)}
            <span className="ml-1 text-xs font-normal text-gray-500">
              / {productData.unit || "একক"}
            </span>
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-bold ${changeColor}`}
            >
              {change > 0 ? "▲" : change < 0 ? "▼" : "—"}{" "}
              {Math.abs(change).toFixed(2)}%
            </span>
          </div>

          {Array.isArray(productData.markets) &&
            productData.markets.length > 0 && (
              <div className="mt-3 border-t border-gray-100 pt-2">
                <p className="mb-1 text-xs font-semibold text-gray-600">
                  বাজারভিত্তিক দাম
                </p>

                {productData.markets.slice(0, 2).map(
                  (market, index) => (
                    <div
                      key={`${market.market || market.name || "market"}-${index}`}
                      className="flex flex-wrap justify-between gap-2 text-xs text-gray-500"
                    >
                      <span>
                        {market.market || market.name || "বাজার"}
                      </span>

                      <span>
                        ৳{formatPrice(Number(market.min) || 0)}
                        {" - "}
                        ৳{formatPrice(Number(market.max) || 0)}
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}

          <p className="mt-3 text-xs font-semibold text-green-700">
            বিস্তারিত দেখুন →
          </p>
        </div>
      </div>
    </article>
  );
}