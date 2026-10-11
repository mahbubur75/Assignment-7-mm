"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const categories = [
  { name: "চাল", slug: "chal", icon: "🍚" },
  { name: "ডাল", slug: "dal", icon: "🫘" },
  { name: "তেল", slug: "tel", icon: "🫙" },
  { name: "সবজি", slug: "sobji", icon: "🥬" },
  { name: "মাছ", slug: "mach", icon: "🐟" },
  { name: "মাংস", slug: "mangsho", icon: "🍗" },
  { name: "ডিম-দুধ", slug: "dim-dudh", icon: "🥚" },
  { name: "মসলা", slug: "moshla", icon: "🌶️" },
];

const tickerItems = [
  {
    emoji: "🍚",
    name: "চাল",
    price: "৬৮ টাকা/কেজি",
    change: "▲ ১.৫%",
    trend: "up",
  },
  {
    emoji: "🫘",
    name: "ডাল",
    price: "১২০ টাকা/কেজি",
    change: "▲ ০.৮%",
    trend: "up",
  },
  {
    emoji: "🫙",
    name: "তেল",
    price: "১৭০ টাকা/লিটার",
    change: "▼ ১.২%",
    trend: "down",
  },
  {
    emoji: "🥬",
    name: "সবজি",
    price: "৪০ টাকা/কেজি",
    change: "▼ ২.১%",
    trend: "down",
  },
  {
    emoji: "🐟",
    name: "মাছ",
    price: "২৮০ টাকা/কেজি",
    change: "▲ ২.৪%",
    trend: "up",
  },
  {
    emoji: "🥚",
    name: "ডিম",
    price: "৫৫ টাকা/হালি",
    change: "— ০.০%",
    trend: "flat",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const loggedIn = Boolean(session?.user);

  const date = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  function closeMenu() {
    setMenuOpen(false);
  }

  async function handleSignOut() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(
          result.error.message || "সাইন আউট করা যায়নি"
        );
        return;
      }

      setMenuOpen(false);
      toast.success("সফলভাবে সাইন আউট হয়েছে");

      router.replace("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করতে সমস্যা হয়েছে");
    } finally {
      setLoggingOut(false);
    }
  }

  function renderAuthLinks(mobile = false) {
    const buttonClass = mobile
      ? "w-full rounded-lg px-4 py-3 text-center text-sm font-semibold"
      : "rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm";

    if (isPending) {
      return (
        <span className="animate-pulse px-3 py-2 text-sm text-gray-400">
          অপেক্ষা করুন...
        </span>
      );
    }

    if (loggedIn) {
  const userName =
    session?.user?.name?.trim() || "ব্যবহারকারী";

  return (
    <>
      <Link
        href="/profile"
        onClick={closeMenu}
        title="আমার প্রোফাইল"
        className={`${buttonClass} flex items-center justify-center gap-2 border border-transparent text-white transition hover:text-green-400`}
      >
        <span className="text-base">👤</span>
        <span className="max-w-xs truncate">
          {userName}
        </span>
      </Link>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={loggingOut}
        className={`${buttonClass} bg-red-600 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {loggingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
      </button>
    </>
  );
}

    return (
      <>
        <Link
          href="/signin"
          onClick={closeMenu}
          className={`${buttonClass} border border-white/20 text-white hover:border-green-400 hover:text-green-400`}
        >
          সাইন ইন
        </Link>

        <Link
          href="/signup"
          onClick={closeMenu}
          className={`${buttonClass} bg-green-700 text-white hover:bg-green-600`}
        >
          সাইন আপ
        </Link>
      </>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#101510]/95 text-white shadow-sm backdrop-blur-xl">
      {/* Logo, date and authentication */}
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex min-w-0 items-center gap-2"
          aria-label="বাজার দর হোম পেজ"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#16864a] p-1">
            <Image
              src="/logo-icon.png"
              alt="বাজার দর"
              width={44}
              height={44}
              priority
              className="h-full w-full object-contain"
            />
          </span>

          <span className="min-w-0">
            <span className="block whitespace-nowrap text-xl font-black sm:text-2xl">
              বাজার <span className="text-[#35b66a]">দর</span>
            </span>

            <span className="mt-1 block text-[10px] text-gray-400 sm:text-xs">
              {date}
            </span>
          </span>
        </Link>

        {/* Desktop authentication */}
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          {renderAuthLinks()}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={menuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/20 text-xl transition hover:bg-white/10 sm:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Category navigation */}
      <nav
        aria-label="পণ্যের ক্যাটাগরি"
        className="border-t border-white/10"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 sm:justify-center sm:px-6 lg:px-8">
          <Link
            href="/"
            onClick={closeMenu}
            aria-current={pathname === "/" ? "page" : undefined}
            className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${
              pathname === "/"
                ? "bg-[#16864a] text-white"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            সব পণ্য
          </Link>

          {categories.map((category) => {
            const href = `/category/${category.slug}`;

            const active =
              pathname === href ||
              pathname.startsWith(`${href}/`);

            return (
              <Link
                key={category.slug}
                href={href}
                onClick={closeMenu}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[#16864a] text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile authentication menu */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#101510] sm:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
            {renderAuthLinks(true)}
          </div>
        </div>
      )}

      {/* Scrolling price ticker */}
      <div className="overflow-hidden border-t border-white/10 bg-[#151b15]">
        <div className="group overflow-hidden py-3">
          <div className="flex w-max animate-[ticker_32s_linear_infinite] items-center group-hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1}
                className="flex shrink-0 items-center"
              >
                {tickerItems.map((item) => (
                  <span
                    key={`${copy}-${item.name}`}
                    className="flex shrink-0 items-center gap-2 px-5 text-xs sm:text-sm"
                  >
                    <span>{item.emoji}</span>

                    <span className="font-semibold">
                      {item.name}
                    </span>

                    <span className="text-gray-300">
                      {item.price}
                    </span>

                    <span
                      className={
                        item.trend === "up"
                          ? "font-semibold text-green-400"
                          : item.trend === "down"
                            ? "font-semibold text-red-400"
                            : "font-semibold text-gray-400"
                      }
                    >
                      {item.change}
                    </span>

                    <span className="text-gray-600">•</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}