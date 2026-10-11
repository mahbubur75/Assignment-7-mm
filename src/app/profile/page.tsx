"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin?callbackURL=%2Fprofile");
    }
  }, [isPending, session, router]);

  // Update name
  async function updateName() {
    if (!name.trim()) {
      toast.error("তোমার নাম লিখো");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.updateUser({
        name: name.trim(),
      });

      if (result.error) {
        toast.error(
          result.error.message || "নাম পরিবর্তন করা যায়নি।"
        );
        return;
      }

      toast.success("নাম সফলভাবে পরিবর্তন হয়েছে।");
      await authClient.getSession();
    } catch {
      toast.error("নাম পরিবর্তন করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }

  // Update email
  async function updateEmail() {
    if (!email.trim()) {
      toast.error("নতুন ইমেইল লিখো");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.changeEmail({
        newEmail: email.trim(),
        callbackURL: "/profile",
      });

      if (result.error) {
        toast.error(
          result.error.message || "ইমেইল পরিবর্তন করা যায়নি।"
        );
        return;
      }

      toast.success(
        "ইমেইল পরিবর্তনের অনুরোধ করা হয়েছে। ইমেইল ভেরিফিকেশন লাগতে পারে।"
      );
    } catch {
      toast.error("ইমেইল পরিবর্তন করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }

  // Update password
  async function updatePassword() {
    if (!currentPassword || !newPassword) {
      toast.error("বর্তমান ও নতুন পাসওয়ার্ড দুটোই লিখো");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (result.error) {
        toast.error(
          result.error.message || "পাসওয়ার্ড পরিবর্তন করা যায়নি।"
        );
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      toast.success("পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।");
    } catch {
      toast.error("পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }

  // Show loading while checking the session
  if (isPending || (!session && !isPending)) {
    return (
      <>
        
        <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
          <p className="text-gray-600">প্রোফাইল লোড হচ্ছে...</p>
        </main>
      
      </>
    );
  }

  // Initialize fields from the signed-in user's information
  if (session?.user && !initialized) {
    setName(session.user.name || "");
    setEmail(session.user.email || "");
    setInitialized(true);
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      

      <main className="flex-1 px-4 py-10 sm:px-6 lg:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              My Profile
            </h1>
            <p className="mt-2 text-gray-600">
              তোমার অ্যাকাউন্টের তথ্য আপডেট করো
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile information */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="mb-5 text-xl font-semibold text-gray-900">
                Personal Information
              </h2>

              <div className="mb-5">
                <label
                  htmlFor="profile-name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>

                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                  placeholder="তোমার নাম লিখো"
                  autoComplete="name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  placeholder="তোমার ইমেইল লিখো"
                  autoComplete="email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={updateName}
                  disabled={loading}
                  className="rounded-lg bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Please wait..." : "Update Name"}
                </button>

                <button
                  type="button"
                  onClick={updateEmail}
                  disabled={loading}
                  className="rounded-lg border border-green-600 px-5 py-3 font-medium text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Update Email
                </button>
              </div>
            </section>

            {/* Change password */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="mb-5 text-xl font-semibold text-gray-900">
                Change Password
              </h2>

              <div className="mb-5">
                <label
                  htmlFor="current-password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>

                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) =>
  setCurrentPassword(e.currentTarget.value)
}
                  placeholder="বর্তমান পাসওয়ার্ড"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="new-password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>

                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.currentTarget.value)
                  }
                  placeholder="নতুন পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)"
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <button
                type="button"
                onClick={updatePassword}
                disabled={loading}
                className="rounded-lg bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Please wait..." : "Change Password"}
              </button>
            </section>
          </div>
        </div>
      </main>

  
    </div>
  );
}