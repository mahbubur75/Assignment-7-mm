import type { Product } from "../types/product";

// বাংলা ও ইংরেজি সংখ্যাকে number-এ রূপান্তর
export function toNumber(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value !== "string") {
    return 0;
  }

  const normalized = value.replace(/[০-৯]/g, (digit) =>
    String("০১২৩৪৫৬৭৮৯".indexOf(digit))
  );

  const number = Number(normalized.replace(/[^\d.-]/g, ""));

  return Number.isFinite(number) ? number : 0;
}

// বাংলা সংখ্যায় দাম দেখানো
export function formatPrice(value: number): string {
  return value.toLocaleString("bn-BD");
}

// পণ্যের বাংলা নাম
export function getProductName(product: Product): string {
  return product.nameBn || "পণ্যের নাম নেই";
}

// আজকের দাম
export function getProductPrice(product: Product): number {
  return toNumber(product.today);
}

// দাম কত শতাংশ পরিবর্তন হয়েছে
export function getChangePercent(product: Product): number {
  const today = toNumber(product.today);
  const yesterday = toNumber(product.yesterday);
  const percent = toNumber(product.pct);

  // আগের দিনের দাম থাকলে সেটি দিয়ে হিসাব
  if (yesterday > 0 && today > 0) {
    return ((today - yesterday) / yesterday) * 100;
  }

  // API-তে pct থাকলে সেটি ব্যবহার
  return percent;
}

// পণ্যের জন্য emoji
export function getProductEmoji(product: Product): string {
  const text = `${product.nameBn} ${product.category}`;

  if (/চাল|rice/i.test(text)) return "🍚";
  if (/ডাল|lentil/i.test(text)) return "🫘";
  if (/তেল|oil/i.test(text)) return "🫙";
  if (/আলু|potato/i.test(text)) return "🥔";
  if (/পেঁয়াজ|পেঁয়াজ|onion/i.test(text)) return "🧅";
  if (/মরিচ|chili/i.test(text)) return "🌶️";
  if (/মাছ|fish/i.test(text)) return "🐟";
  if (/মাংস|মুরগি|chicken/i.test(text)) return "🍗";
  if (/ডিম|egg/i.test(text)) return "🥚";
  if (/রসুন|garlic/i.test(text)) return "🧄";
  if (/আদা|ginger/i.test(text)) return "🫚";
  if (/সবজি|শাক|vegetable/i.test(text)) return "🥬";

 const categoryIcon = product.categoryIcon;

  return typeof categoryIcon === "string"
    ? categoryIcon
    : "🛒";
}

// দাম বেড়েছে এমন সর্বোচ্চ ৬টি পণ্য
export function getPriceRisers(products: Product[]): Product[] {
  return products
    .filter((product) => getChangePercent(product) > 0)
    .sort(
      (a, b) => getChangePercent(b) - getChangePercent(a)
    )
    .slice(0, 6);
}

// দাম কমেছে এমন সর্বোচ্চ ৬টি পণ্য
export function getPriceFallers(products: Product[]): Product[] {
  return products
    .filter((product) => getChangePercent(product) < 0)
    .sort(
      (a, b) => getChangePercent(a) - getChangePercent(b)
    )
    .slice(0, 6);
}

export function getChange(product: {
  dir?: string;
  pct?: number | string;
}): number {
  const value = Number(product.pct ?? 0);

  if (!Number.isFinite(value)) return 0;

  if (product.dir === "up") return Math.abs(value);
  if (product.dir === "down") return -Math.abs(value);

  return 0;
}