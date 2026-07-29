"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Bell } from "lucide-react";
import Logout from "@/components/logout";

export default function UserNav({
  name = "",
  buisnessName = "",
}: {
  name?: string;
  buisnessName?: string;
}) {
  const [userName, setUserName] = useState(name);
  const [bizName, setBizName] = useState(buisnessName);
  const [profile, setProfile] = useState<any>(null);
  const [avatar, setAvatar] = useState("/profilePhoto.png");

  useEffect(() => {
    // Sync state if props change
    if (name) setUserName(name);
    if (buisnessName) setBizName(buisnessName);

    // Fetch user profile dynamically to get the email, image, and complete info
    fetch("/api/protected/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setProfile(data.profile);
          if (data.profile.image) setAvatar(data.profile.image);
          if (!name) setUserName(data.profile.name || "");
          if (!buisnessName) setBizName(data.profile.buisnessName || "");
        }
      })
      .catch((err) => console.error("Error fetching UserNav profile:", err));
  }, [name, buisnessName]);

  // Listen to profile photo changes dynamically from other pages without reloading
  useEffect(() => {
    function handleAvatarChange(e: Event) {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail === "string") {
        setAvatar(customEvent.detail);
      }
    }
    window.addEventListener("profile-avatar-update", handleAvatarChange);
    return () => {
      window.removeEventListener("profile-avatar-update", handleAvatarChange);
    };
  }, []);

  return (
    <div>
      <section>
        {/* userNav user navigation profile details */}
        <div className="w-full border-b border-gray-100 ">
          {/* user profile */}
          <div className="p-2">
            <div className="flex justify-between items-center px-4 py-2">
              <div className="relative">
                <span className="hidden md:block">Dashboard</span>
              </div>

              <div className="flex items-end gap-2">
                <div className="bg-gray-100 p-2 rounded-full ">
                  <Bell className="h-5 w-5 text-brand-primary-[#0b7a75] dark:text-gray-400" />
                </div>
                <div className=""></div>
                <div className="flex flex-col">
                  {/* business name */}
                  <span className="hidden md:block text-sm font-medium text-gray-900">
                     {bizName}  
                  </span>
                  {/* username */}
                  <span className="hidden md:block text-xs text-gray-500">
                     {userName}
                  </span>
                </div>
                <div className="w-10 h-10  rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                  <Image
                    className="rounded-full object-cover w-10 h-10"
                    src={avatar}
                    alt="user profile photo"
                    width={40}
                    height={40}
                    unoptimized
                  />
                </div>
                {/* <div>
                  <Logout user={profile} />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
