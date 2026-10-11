"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";

export default function SigninPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      const message = "ইমেইল ও পাসওয়ার্ড লিখুন।";
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);

    try {
      const result = await signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        const message =
          result.error.message || "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।";

        setError(message);
        toast.error(message);
        return;
      }

      toast.success("সাইন ইন সফল হয়েছে!");

      const requestedPath = searchParams.get("callbackURL");

      const destination =
        requestedPath &&
        requestedPath.startsWith("/") &&
        !requestedPath.startsWith("//") &&
        !requestedPath.startsWith("/\\")
          ? requestedPath
          : "/";

      router.replace(destination);
      router.refresh();
    } catch {
      const message = "সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.currentTarget.value);
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.currentTarget.value);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Sign In
        </h1>

        <p className="mb-8 text-center text-sm text-gray-600">
          আপনার অ্যাকাউন্টে প্রবেশ করুন
        </p>

        <form onSubmit={handleSignin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={handleEmailChange}
              placeholder="আপনার ইমেইল লিখুন"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={handlePasswordChange}
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>

        <Link
          href="/"
          className="mt-5 block text-center text-sm text-gray-500 hover:underline"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}