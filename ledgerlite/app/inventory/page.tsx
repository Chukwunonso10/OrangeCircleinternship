import InventoryClient from "@/components/inventoryClient";
import { getCurrentUserId } from "../lib/authhelper";
import prisma from "../lib/prisma";
import { redirect } from "next/navigation";

export default async function InventoryPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/signin");

  // Fetch all items belonging to this user
  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Serialize Prisma Date fields to string format
  const serializedItems = items.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));

  return <InventoryClient initialItems={serializedItems} />;
}
