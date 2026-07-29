"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { EllipsisVertical } from "lucide-react";
import { getCurrentUser } from "@/app/lib/authhelper";

export default function Logout({
  user
}: { user?: any; }) {
  const User = user
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setConfirmOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  async function handleSignOut() {
    try {
      const response = await fetch("/api/protected/logout", {
        method: "POST",
      });

      if (response.ok) {
        setConfirmOpen(false);
        setOpen(false);
        router.push("/signin");
        router.refresh();
      } else {
        alert("Failed to sign out. Please try again.");
      }
    } catch (error) {
      console.error("Sign out error:", error);
      alert("Network error: Could not complete sign out.");
    }
  }

  return (
    <div className="relative inline-block text-left">
      <button
        ref={btnRef}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-md hover:bg-gray-100 cursor-pointer  "
        title="Account"
      >
        <EllipsisVertical size={20} />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-4 w-50 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50"
        >
          <div className="px-4 py-2">
            <p className="text-sm py-2 font-medium text-gray-900 ">
              {/* user name */}
              {/* {user?.name ?? "Username"} */}
              { User?.name ?? "God abeg o"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {/* businesname */}
              {/* {user?.email ?? "email@example.com"} */}
               {User?.email ?? "God pls na"}
            </p>
          </div>
          <div className="border-t border-gray-100 dark:border-zinc-800" />
          <div className="py-1">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer "
              role="menuitem"
              onClick={() => setConfirmOpen(true)}
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setConfirmOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-sm mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Confirm sign out
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to sign out?
            </p>
            <div className="mt-4 flex gap-2 justify-end">
              <button
                className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm cursor-pointer"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm cursor-pointer"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
