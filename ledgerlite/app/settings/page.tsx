import SideNav from "@/components/sideNav";
import UserNav from "@/components/userNav";
import { getCurrentUser } from "../lib/authhelper";
import { redirect } from "next/navigation";
import SettingsLogoutButton from "@/components/SettingsLogoutButton";

export default async function Settings() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/signin");
  }

  const { name, buisnessName, email } = user;

  return (
    <div>
      <div>
        <div>
          <SideNav />
        </div>
        <div className="ml-0 md:ml-70 sm:ml-0">
          <UserNav name={name} buisnessName={buisnessName} />
        </div>
        <main className="ml-10 md:ml-72 sm:ml-10 p-6">
          <div className="max-w-4xl space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Settings
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Manage your business account settings and configurations.
              </p>
            </div>

            {/* Profile Information Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Profile Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Owner Name
                  </label>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {name}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Business Name
                  </label>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {buisnessName}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {email}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Actions Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Account Actions
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Disconnect your session from this device.
              </p>
              <div>
                <SettingsLogoutButton />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}