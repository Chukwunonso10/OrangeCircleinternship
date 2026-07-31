import SideNav from "@/components/sideNav";
import UserNav from "@/components/userNav";
import { getCurrentUser } from "../lib/authhelper";
import { redirect } from "next/navigation";
import SettingsLogoutButton from "@/components/SettingsLogoutButton";
import { User as UserIcon, Building, Mail, Settings as SettingsIcon, Shield } from "lucide-react";

export default async function Settings() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/signin");
  }

  const { name, buisnessName, email } = user;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div>
        <div>
          <SideNav />
        </div>
        <div className="ml-0 md:ml-70 sm:ml-0">
          <UserNav name={name} buisnessName={buisnessName} />
        </div>
        <main className="ml-10 md:ml-72 sm:ml-10 p-6">
          <div className="max-w-4xl space-y-8">
            {/* Page Header */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#0B7A75]/10 text-[#0B7A75] rounded-2xl">
                <SettingsIcon className="w-8 h-8 animate-[spin_8s_linear_infinite]" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  Settings
                </h1>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  Manage your business profile and security configurations.
                </p>
              </div>
            </div>

            {/* Profile Information Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm transition hover:shadow-md">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2 bg-[#0B7A75]/10 text-[#0B7A75] rounded-xl">
                  <UserIcon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Profile Details
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 transition hover:border-[#0B7A75]/30">
                  <div className="p-3 bg-[#0B7A75]/10 text-[#0B7A75] rounded-xl shrink-0 h-11 w-11 flex items-center justify-center">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Owner Name
                    </label>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {name}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 transition hover:border-[#0B7A75]/30">
                  <div className="p-3 bg-[#0B7A75]/10 text-[#0B7A75] rounded-xl shrink-0 h-11 w-11 flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Business Name
                    </label>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {buisnessName}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2 flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 transition hover:border-[#0B7A75]/30">
                  <div className="p-3 bg-[#0B7A75]/10 text-[#0B7A75] rounded-xl shrink-0 h-11 w-11 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm transition hover:shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#0B7A75]/10 text-[#0B7A75] rounded-xl">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Security & Session
                </h2>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-xl">
                Manage your active browser session. Disconnecting will log you out from this device immediately.
              </p>
              <div className="pt-2">
                <SettingsLogoutButton />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}