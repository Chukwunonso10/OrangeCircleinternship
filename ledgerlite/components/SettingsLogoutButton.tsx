"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function SettingsLogoutButton() {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    try {
      const response = await fetch("/api/protected/logout", {
        method: "POST",
      });

      if (response.ok) {
        setConfirmOpen(false);
        router.push("/signin");
        router.refresh();
      } else {
        alert("Failed to sign out. Please try again.");
      }
    } catch (error) {
      console.error("Sign out error:", error);
      alert("Network error: Could not complete sign out.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setConfirmOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50 rounded-xl text-sm font-semibold transition cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setConfirmOpen(false)}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Sign Out of LedgerLite
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to log out of your account? Any unsaved transaction logs could be lost.
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition cursor-pointer"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 text-sm font-medium transition cursor-pointer disabled:opacity-50"
                onClick={handleSignOut}
                disabled={loading}
              >
                {loading ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
