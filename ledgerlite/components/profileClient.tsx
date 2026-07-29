"use client";

import { useState, useRef } from "react";
import { Camera, User, Mail, Building, Calendar, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface ProfileClientProps {
  initialName: string;
  initialEmail: string;
  initialBuisnessName: string;
  initialImage: string;
  createdAt: string;
}

export default function ProfileClient({
  initialName,
  initialEmail,
  initialBuisnessName,
  initialImage,
  createdAt,
}: ProfileClientProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(initialName);
  const [buisnessName, setBuisnessName] = useState(initialBuisnessName);
  const [image, setImage] = useState(initialImage || "/profilePhoto.png");
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Format Date
  const joinDate = new Date(createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Handle Profile Photo Upload
  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // File size check: 1.5MB max to protect DB payload limits
    if (file.size > 1.5 * 1024 * 1024) {
      setErrorMessage("Image must be smaller than 1.5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImage(base64String);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  }

  // Handle Form Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/protected/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          buisnessName,
          image,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage("Profile updated successfully!");
        
        // Dispatch custom event to dynamically update the avatar in UserNav without reload
        const event = new CustomEvent("profile-avatar-update", { detail: image });
        window.dispatchEvent(event);
      } else {
        setErrorMessage(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setErrorMessage("Network error: Could not save profile changes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl border border-slate-200 bg-white p-8 rounded-4xl shadow-sm">
      <div className="border-b border-slate-100 pb-6 mb-8 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-slate-900">Profile Settings</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage your personal details, business name, and profile credentials.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Avatar Selection */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-start">
          <div className="relative group h-28 w-28 overflow-hidden rounded-full border-2 border-[#0b7a75] bg-slate-50 flex items-center justify-center shadow-md">
            <Image
              src={image}
              alt="User avatar"
              width={112}
              height={112}
              className="h-full w-full object-cover"
              unoptimized
            />
            {/* Hover Camera Overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 cursor-pointer"
              title="Change profile picture"
            >
              <Camera size={20} />
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider">
                Upload
              </span>
            </button>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-sm font-semibold text-slate-800">Profile Picture</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-xs">
              Supports JPEG, PNG or WEBP formats. Maximum file size of 1.5MB.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer"
            >
              <Camera size={12} />
              Choose File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
          </div>
        </div>

        {/* Feedback Messages */}
        {successMessage && (
          <div className="flex items-center gap-2 rounded-2xl bg-[#edf7f6] p-4 text-sm font-medium text-[#0b7a75]">
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600">
            {errorMessage}
          </div>
        )}

        {/* Form Inputs */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#0b7a75] focus:ring-2 focus:ring-[#6DAFAC]/15"
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="bizName" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Business Name
            </label>
            <div className="relative">
              <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="bizName"
                type="text"
                required
                value={buisnessName}
                onChange={(e) => setBuisnessName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#0b7a75] focus:ring-2 focus:ring-[#6DAFAC]/15"
                placeholder="Enter business name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                disabled
                value={initialEmail}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-500 shadow-sm outline-none cursor-not-allowed"
                title="Email cannot be changed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Date Joined
            </label>
            <div className="relative">
              <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                disabled
                value={joinDate}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-500 shadow-sm outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0b7a75] text-white hover:bg-[#09615e] px-6 py-3 text-sm font-semibold shadow-sm transition active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
