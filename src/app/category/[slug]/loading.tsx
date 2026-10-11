export default function CategoryLoading() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        {/* Breadcrumb */}
        <div className="mb-6 h-4 w-40 rounded bg-gray-200" />

        {/* Category Header */}
        <div className="mb-8 flex items-center gap-4 rounded-2xl bg-white p-6">
          <div className="h-16 w-16 shrink-0 rounded-2xl bg-gray-200" />

          <div className="flex-1 space-y-3">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-7 w-48 max-w-full rounded bg-gray-200" />
            <div className="h-4 w-64 max-w-full rounded bg-gray-200" />
          </div>
        </div>

        {/* Sort Control */}
        <div className="mb-5 flex flex-col gap-4 rounded-xl bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-5 w-32 rounded bg-gray-200" />
            <div className="h-4 w-48 rounded bg-gray-200" />
          </div>

          <div className="h-11 w-full rounded-lg bg-gray-200 sm:w-56" />
        </div>

        {/* Product Card Skeletons */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-100 bg-white p-4"
            >
              <div className="mb-4 h-36 rounded-lg bg-gray-200" />
              <div className="mb-3 h-5 w-3/4 rounded bg-gray-200" />
              <div className="mb-4 h-4 w-1/2 rounded bg-gray-200" />
              <div className="h-10 rounded-lg bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}