"use client";

import { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Eye, X, Loader2, Pencil } from "lucide-react";
import Pagination from "./pagination";
import { editSale } from "@/app/lib/actions";
import { toast } from "react-hot-toast";

interface SalesItem {
  id: string;
  itemName?: string;
  item?: { name: string } | null;
  customItemName?: string | null;
  quantity: number;
  amount?: number;
  totalAmount?: any;
  createdAt?: string | Date;
  timestamp?: string;
}

interface SalesCardProps {
  sales?: any[];
  currentPage?: number;
  totalPages?: number;
  totalSales?: number;
  pageSize: number
}

export default function SalesCard({
  sales = [],
  currentPage = 1,
  totalPages = 1,
  totalSales = 0,
  pageSize,
}: SalesCardProps) {
  const router = useRouter();
  
  // Details Modal State
  const [selectedSale, setSelectedSale] = useState<any | null>(null);
  
  // Deleting Loading State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Editing Modal State
  const [editingSale, setEditingSale] = useState<any | null>(null);

  const displaySales = sales;

  // Handle Delete Action
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this sale? This will restore inventory stock counts for tracked items.")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/routes/sales/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Sale deleted successfully!");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete sale.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Network error: Could not delete sale.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Item Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Quantity
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Time
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displaySales.map((item) => {
              const name = item.itemName || item.item?.name || item.customItemName || "Untracked Item";
              const amountValue = item.amount !== undefined ? item.amount : (item.totalAmount !== undefined ? Number(item.totalAmount) : 0);
              
              let formattedDate = "";
              if (item.createdAt && !isNaN(Date.parse(String(item.createdAt)))) {
                formattedDate = new Date(item.createdAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                });
              } else if (item.timestamp) {
                formattedDate = item.timestamp;
              }

              const isDeleting = deletingId === item.id;

              return (
                <tr key={item.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">
                      {name}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center rounded-lg bg-[#0b7a75]/10 px-3 py-1 text-sm font-semibold text-[#0b7a75]">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900">
                      ₦{amountValue.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-0 py-4">
                    <p className="text-xs text-slate-500">{formattedDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedSale(item)}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-[#0b7a75]/5 hover:text-[#0b7a75] disabled:opacity-50 cursor-pointer"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingSale(item)}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600 disabled:opacity-50 cursor-pointer"
                        title="Edit sale"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50 cursor-pointer"
                        title="Delete"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {displaySales.length === 0 && (
        <div className="flex items-center justify-center px-6 py-12">
          <p className="text-sm text-slate-500">No sales records found.</p>
        </div>
      )}

      {/* Footer Page Indicators */}
      <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} />
      </div>

      {/* Dynamic View Transaction Details Modal */}
      {selectedSale && (() => {
        const name = selectedSale.itemName || selectedSale.item?.name || selectedSale.customItemName || "Untracked Item";
        const total = selectedSale.amount !== undefined ? selectedSale.amount : (selectedSale.totalAmount !== undefined ? Number(selectedSale.totalAmount) : 0);
        const qty = selectedSale.quantity;
        const unit = qty > 0 ? (total / qty) : 0;
        
        let formattedDate = "";
        if (selectedSale.createdAt && !isNaN(Date.parse(String(selectedSale.createdAt)))) {
          formattedDate = new Date(selectedSale.createdAt).toLocaleString(undefined, {
            dateStyle: "long",
            timeStyle: "medium",
          });
        } else if (selectedSale.timestamp) {
          formattedDate = selectedSale.timestamp;
        }

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 animate-in fade-in duration-150">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
              aria-hidden="true"
              onClick={() => setSelectedSale(null)}
            />

            <div
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/10"
              style={{
                animation: "modal-slide-in 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Sale Transaction Details</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    ID: {selectedSale.id}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSale(null)}
                  className="rounded-full p-2 text-slate-500 transition duration-200 hover:bg-slate-100 hover:text-slate-900 hover:rotate-90 cursor-pointer"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 py-6 space-y-4">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Item Name</span>
                  <span className="text-sm font-semibold text-slate-900">{name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Quantity Sold</span>
                  <span className="text-sm font-semibold text-slate-900">{qty}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Unit Price</span>
                  <span className="text-sm font-semibold text-slate-900">
                    ₦{unit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500 font-medium">Total Amount</span>
                  <span className="text-base font-bold text-[#0b7a75]">₦{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-slate-500">Time Logged</span>
                  <span className="text-xs text-slate-700">{formattedDate}</span>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedSale(null)}
                    className="rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 px-5 py-3 text-sm font-semibold transition active:scale-95 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      {/* Edit Sale Modal */}
      {editingSale && (
        <EditSaleModal
          sale={editingSale}
          onClose={() => {
            setEditingSale(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function EditSaleModal({
  sale,
  onClose,
}: {
  sale: any;
  onClose: () => void;
}) {
  const [itemType, setItemType] = useState<"tracked" | "custom">(
    sale.itemId ? "tracked" : "custom"
  );
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Load products list for tracked selector
  useEffect(() => {
    setLoadingProducts(true);
    fetch("/api/routes/item")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.allProducts || []);
        }
      })
      .catch((err) => console.error("Error loading products:", err))
      .finally(() => setLoadingProducts(false));
  }, []);

  // Bind method to attach sale.id as the first argument
  const editSaleWithId = editSale.bind(null, sale.id);

  // Hook Server Action
  const [state, formAction, isPending] = useActionState(editSaleWithId, null);

  // Auto-close modal when action returns successfully
  useEffect(() => {
    if (state?.success) {
      toast.success("Sale updated successfully!");
      onClose();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, onClose]);

  // Pre-calculate unit price defaults
  const amountValue = sale.amount !== undefined ? sale.amount : (sale.totalAmount !== undefined ? Number(sale.totalAmount) : 0);
  const qtyValue = sale.quantity || 1;
  const unitPriceValue = sale.unitPrice !== undefined ? Number(sale.unitPrice) : (qtyValue > 0 ? (amountValue / qtyValue) : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 animate-in fade-in duration-150">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
        aria-hidden="true"
        onClick={() => !isPending && onClose()}
      />

      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/10"
        style={{
          animation: "modal-slide-in 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Edit Sale Transaction</h2>
            <p className="mt-1 text-xs text-slate-500">
              Update sale details for ID: {sale.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-full p-2 text-slate-500 transition duration-200 hover:bg-slate-100 hover:text-slate-900 hover:rotate-90 cursor-pointer disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form action={formAction} className="space-y-5 px-6 py-6">
          {state?.error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-lg text-sm">
              {state.error}
            </div>
          )}

          {/* Segment Selector for Tracked vs Custom */}
          {products.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Product Source
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setItemType("tracked")}
                  disabled={isPending}
                  className={`py-2 text-xs font-semibold rounded-lg transition duration-150 cursor-pointer ${
                    itemType === "tracked"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Tracked Inventory
                </button>
                <button
                  type="button"
                  onClick={() => setItemType("custom")}
                  disabled={isPending}
                  className={`py-2 text-xs font-semibold rounded-lg transition duration-150 cursor-pointer ${
                    itemType === "custom"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Custom / Untracked
                </button>
              </div>
            </div>
          )}

          {/* Item source selections using defaultValues */}
          <div className="space-y-2">
            <label htmlFor="edit-item-name" className="block text-sm font-medium text-slate-700">
              Item
            </label>
            {itemType === "tracked" && products.length > 0 ? (
              <select
                id="edit-item-name"
                name="itemId"
                defaultValue={sale.itemId || products[0]?.id}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-[#0b7a75]"
                disabled={loadingProducts || isPending}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stock: {p.currentStock})
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="edit-item-name"
                name="customItemName"
                type="text"
                defaultValue={sale.customItemName || sale.itemName || ""}
                placeholder="Enter custom item name"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-[#0b7a75]"
                disabled={isPending}
                required
              />
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Quantity */}
            <div className="space-y-2">
              <label htmlFor="edit-quantity-input" className="block text-sm font-medium text-slate-700">
                Quantity
              </label>
              <input
                id="edit-quantity-input"
                name="quantity"
                type="number"
                defaultValue={qtyValue}
                placeholder="0"
                min={1}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-[#0b7a75]"
                disabled={isPending}
                required
              />
            </div>

            {/* Unit Price */}
            <div className="space-y-2">
              <label htmlFor="edit-price-input" className="block text-sm font-medium text-slate-700">
                Unit Price (₦)
              </label>
              <input
                id="edit-price-input"
                name="unitPrice"
                type="number"
                defaultValue={unitPriceValue}
                placeholder="0"
                min={0}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-[#0b7a75]"
                disabled={isPending}
                required
              />
            </div>
          </div>

          {/* Submitting buttons */}
          <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-slate-200">
            <div className="flex sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="inline-flex justify-center rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition duration-200 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex justify-center items-center gap-2 rounded-2xl bg-[#0b7a75] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0b7a75]/20 transition duration-200 hover:bg-[#09615e] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

