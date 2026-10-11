export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-center sm:px-6 md:flex-row md:text-left lg:px-8">

        {/* Left Side */}
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">
            বাজার দর
          </span>
          {" "}— প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        {/* Right Side */}
        <p className="text-sm text-gray-500">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>

      </div>
    </footer>
  );
}