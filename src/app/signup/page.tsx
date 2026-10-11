"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient, signUp } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (name.trim().length < 2) {
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
      return;
    }

    if (!email.trim()) {
      toast.error("ইমেইল লিখো");
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.error) {
        toast.error(
          result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি"
        );
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে!");
      router.push("/signin");
    } catch {
      toast.error("সমস্যা হয়েছে। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignup(
    provider: "google" | "github"
  ) {
    setSocialLoading(provider);

    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch {
      toast.error(
        `${provider === "google" ? "Google" : "GitHub"} দিয়ে সাইন আপ করা যায়নি`
      );
      setSocialLoading("");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8f2] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <Link
          href="/"
          className="text-sm text-green-700 hover:underline"
        >
          ← বাজার দর হোম পেজ
        </Link>

        <div className="mb-7 mt-6 text-center">
          <div className="mb-3 text-4xl">🛒</div>

          <h1 className="text-2xl font-bold text-gray-900">
            নতুন অ্যাকাউন্ট তৈরি করো
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            বাজার দর-এ যোগ দাও এবং পণ্যের দাম দেখো
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              তোমার নাম
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              value={name}
              onChange={handleNameChange}
              placeholder="তোমার পুরো নাম"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              ইমেইল
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={handleEmailChange}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              পাসওয়ার্ড
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={handlePasswordChange}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !!socialLoading}
            className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "সাইন আপ করো"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-500">অথবা</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleSocialSignup("google")}
            disabled={loading || !!socialLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            <span className="font-bold text-lg">G</span>
            {socialLoading === "google"
              ? "Google খুলছে..."
              : "Google দিয়ে সাইন আপ"}
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignup("github")}
            disabled={loading || !!socialLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            <span className="text-lg">⌘</span>
            {socialLoading === "github"
              ? "GitHub খুলছে..."
              : "GitHub দিয়ে সাইন আপ"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          আগে থেকেই অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/signin"
            className="font-semibold text-green-700 hover:underline"
          >
            সাইন ইন করো
          </Link>
        </p>
      </div>
    </main>
  );
}