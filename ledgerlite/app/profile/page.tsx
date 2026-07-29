import SideNav from "@/components/sideNav";
import UserNav from "@/components/userNav";
import { getCurrentUserId } from "../lib/authhelper";
import prisma from "../lib/prisma";
import ProfileClient from "@/components/profileClient";
import { redirect } from "next/navigation";

export default async function ProfilePage() {

  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      buisnessName: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });
  if (!user) {
    redirect("/signin");
  }

  return (
    <div>
      <div>
        <div>
          <SideNav />
        </div>
        <div className="ml-0 md:ml-70 sm:ml-0">
          <UserNav name={user.name} buisnessName={user.buisnessName} />
        </div>
        <main className="ml-0 md:ml-72 sm:ml-10 p-6">
          <ProfileClient
            initialName={user.name}
            initialEmail={user.email}
            initialBuisnessName={user.buisnessName}
            initialImage={user.image || ""}
            createdAt={user.createdAt.toISOString()}
          />
        </main>
      </div>
    </div>
  );
}