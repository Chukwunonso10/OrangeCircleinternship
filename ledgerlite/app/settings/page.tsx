import SideNav from "@/components/sideNav";
import UserNav from "@/components/userNav";

export default function Settings() {
  return (
    <div>
      <div>
        <div>
          <SideNav />
        </div>
        <div className="ml-0 md:ml-70 sm:ml-0">
          <UserNav />
        </div>
        <main className="ml-10 md:ml-72 sm:ml-10  p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Settings Page
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                This is the dashboard page. You can manage your dashboard here.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}