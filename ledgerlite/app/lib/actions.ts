"use server";

import prisma from "./prisma";
import { getCurrentUserId } from "./authhelper";
import { revalidatePath } from "next/cache";

export interface InitialState {
  success: boolean;
  error?: {};
}

export async function editSale(saleId: string, prevState: InitialState | null,
  formData: FormData
){
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "Unauthorized: Please log in." };
    }

    const quantityInput = formData.get("quantity");
    const unitPriceInput = formData.get("unitPrice");
    const customItemName = formData.get("customItemName") as string;
    const itemId = formData.get("itemId") as string;

    const quantity = Number(quantityInput);
    const unitPrice = Number(unitPriceInput);

    if (isNaN(quantity) || quantity <= 0) {
      return { success: false, error: "Quantity must be a positive number." };
    }
    if (isNaN(unitPrice) || unitPrice < 0) {
      return { success: false, error: "Unit price cannot be negative." };
    }

    // Verify existence and ownership
    const sale = await prisma.sale.findFirst({
      where: { id: saleId, userId }
    });

    if (!sale) {
      return { success: false, error: "Sale record not found or unauthorized." };
    }

    const totalAmount = quantity * unitPrice;

    // Perform database update
    await prisma.sale.update({
      where: { id: saleId },
      data: {
        itemId: itemId || null,
        customItemName: customItemName || null,
        quantity,
        unitPrice,
        totalAmount
      }
    });

    // Revalidate paths to update browser cache
    revalidatePath("/sales");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("Server Action editSale error:", error);
    return { success: false, error: error.message || "Failed to update sale." };
  }
}
