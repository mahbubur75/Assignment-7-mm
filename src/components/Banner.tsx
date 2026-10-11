import Image from "next/image";

export default function Banner() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">

        {/* Left Content */}
        <div className="w-full sm:w-1/2">
          <p className="text-sm font-medium text-gray-500">
            মঙ্গলবার, ৬ অক্টোবর, ২০২৬
          </p>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-800 sm:text-4xl">
            আজকে বাজারে দাম এক নজরে
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
            চাল, ডাল, তেল, সবজি, মাছ ,মাংস, ডিম ও মসলার দাম - বাজারভিত্তিক বিস্তারিত,
            গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          <a
            href="#সব-পণ্য"
            className="mt-6 inline-block rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            সব পণ্য দেখুন
          </a>
        </div>

        {/* Right Image */}
        <div className="flex w-full justify-center sm:w-1/2 sm:justify-end">
          <Image
            src="/bazar-hero.png"
            alt="বাজারের পণ্য"
            width={350}
            height={300}
            priority
            className="h-auto w-full max-w-sm object-contain"
          />
        </div>

      </div>
    </section>
  );
}