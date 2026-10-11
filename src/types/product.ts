export type Product = {
  id: number | string;
  slug: string;
  nameBn: string;
  name?: string;
  title?: string;
  category?: string | { name?: string; slug?: string };
  unit?: string;
  price?: number | string;
  today?: number | string;
  previousPrice?: number | string;
  change?: number | string;
  changePercent?: number | string;
  description?: string;
  emoji?: string;
  image?: string;
  [key: string]: unknown;
};

export type Category = {
  id?: number | string;
  name?: string;
  nameBn?: string;
  slug?: string;
  icon?: string;
};