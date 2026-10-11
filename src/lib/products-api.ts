import type { Product, Category } from "@/types/product";

export const API_BASE_URL =
  "https://openapi.programming-hero.com/api/bazardor";

// Fetch API data
async function fetchAPI(path: string): Promise<unknown> {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status}`,
    );
  }

  return response.json();
}

// Safely extract arrays from API responses
function extractList<T>(
  response: unknown,
  keys: string[],
): T[] {
  if (Array.isArray(response)) {
    return response as T[];
  }

  if (
    response === null ||
    typeof response !== "object"
  ) {
    return [];
  }

  const object = response as Record<string, unknown>;

  for (const key of keys) {
    if (Array.isArray(object[key])) {
      return object[key] as T[];
    }
  }

  if (object.data !== undefined) {
    return extractList<T>(object.data, keys);
  }

  return [];
}

// Get all products
export async function getProducts(): Promise<Product[]> {
  const response = await fetchAPI("/products");

  return extractList<Product>(response, [
    "products",
    "result",
    "data",
  ]);
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const response = await fetchAPI("/categories");

  return extractList<Category>(response, [
    "categories",
    "result",
    "data",
  ]);
}

// Get products by category
export async function getProductsByCategory(
  slug: string,
): Promise<Product[]> {
  const response = await fetchAPI(
    `/products?category=${encodeURIComponent(slug)}`,
  );

  return extractList<Product>(response, [
    "products",
    "result",
    "data",
  ]);
}

// Get a single product
export async function getProductById(
  id: string,
): Promise<Product | null> {
  const response = await fetchAPI(
    `/products/${encodeURIComponent(id)}`,
  );

  if (
    response === null ||
    typeof response !== "object"
  ) {
    return null;
  }

  const object = response as Record<string, unknown>;

  let data: unknown =
    object.data ?? object.product ?? object.result;

  if (Array.isArray(data)) {
    data = data[0];
  }

  if (data && typeof data === "object") {
    return data as Product;
  }

  if (
    "id" in object ||
    "name" in object ||
    "title" in object
  ) {
    return object as Product;
  }

  return null;
}