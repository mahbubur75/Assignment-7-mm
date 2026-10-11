import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryProducts from "@/components/CategoryProducts";

import {
  getCategories,
  getProductsByCategory,
} from "@/lib/products-api";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  let categories;
  let products;

  try {
    [categories, products] = await Promise.all([
      getCategories(),
      getProductsByCategory(slug),
    ]);
  } catch {
    return (
      <>

        <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
          <span className="text-5xl">⚠️</span>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            তথ্য লোড করা যায়নি
          </h1>

          <p className="mt-3 max-w-md text-gray-600">
            ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করো।
          </p>

          <Link
            href="/"
            className="mt-6 rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
          >
            হোম পেজে ফিরে যাও
          </Link>
        </main>

      
      </>
    );
  }

  const category = categories.find(
    (item) =>
      String(item.slug ?? "").toLowerCase() === slug.toLowerCase()
  );

  // Invalid category হলে 404 page দেখাবে।
  if (!category) {
    notFound();
  }

  const categoryName = category.nameBn || category.name || slug;
  const categoryIcon = category.icon || "🛒";

  return (
    <>
    

      <main className="min-h-[60vh] bg-gray-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-sm text-gray-500"
          >
            <Link href="/" className="hover:text-green-700">
              হোম
            </Link>

            <span>/</span>

            <span className="font-medium text-gray-800">
              {categoryName}
            </span>
          </nav>

          {/* Category Header */}
          <section className="mb-8 rounded-2xl border border-green-100 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-4xl">
                  {categoryIcon}
                </div>

                <div>
                  <p className="text-sm font-medium text-green-700">
                    বাজারদর · ক্যাটাগরি
                  </p>

                  <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                    {categoryName}
                  </h1>

                  <p className="mt-2 text-sm text-gray-600">
                    এই ক্যাটাগরির পণ্যের বর্তমান বাজারদর দেখো।
                  </p>
                </div>
              </div>

              <Link
                href="/"
                className="inline-flex w-fit items-center justify-center rounded-lg border border-green-700 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-50"
              >
                ← সব পণ্য
              </Link>
            </div>
          </section>

          {/* Product List and Sorting */}
          <CategoryProducts products={products} />
        </div>
      </main>

    
    </>
  );
}