"use client";

import { useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, X, Loader2, Pencil } from "lucide-react";
import { toast } from "react-hot-toast";

interface Item {
  id: string;
  name: string;
  lowStock: number;
  currentStock: number;
  createdAt: string;
}

interface InventoryCardProps {
  items?: Item[];
  onDeleteOptimistic: (id: string) => void;
  onEditOptimistic: (id: string, data: any) => void;
}

export default function InventoryCard({
  items = [],
  onDeleteOptimistic,
  onEditOptimistic,
}: InventoryCardProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [updating, setUpdating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Custom Delete Confirm State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Form states for editing
  const [editName, setEditName] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editThreshold, setEditThreshold] = useState("");

  // Perform Actual Delete
  async function performDelete(id: string) {
    setShowDeleteConfirm(null);
    startTransition(async () => {
      onDeleteOptimistic(id);
      setDeletingId(id);
      try {
        const response = await fetch(`/api/routes/item/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (response.ok && result.success) {
          toast.success("Product deleted successfully!");
          router.refresh();
        } else {
          toast.error(result.message || "Failed to delete product.");
          router.refresh();
        }
      } catch (error) {
        console.error("Delete product error:", error);
        toast.error("Network error: Could not delete product.");
        router.refresh();
      } finally {
        setDeletingId(null);
      }
    });
  }

  // Handle edit launch
  function startEdit(item: Item) {
    setEditingItem(item);
    setEditName(item.name);
    setEditStock(String(item.currentStock));
    setEditThreshold(String(item.lowStock));
    setEditError(null);
  }

  // Handle Update Form Submit
  async function handleUpdateProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingItem) return;

    setUpdating(true);
    setEditError(null);

    const name = editName.trim();
    const currentStock = Number(editStock);
    const lowStock = Number(editThreshold);

    if (!name) {
      setEditError("Product name is required.");
      setUpdating(false);
      return;
    }

    if (isNaN(currentStock) || currentStock < 0) {
      setEditError("Quantity in Stock must be a non-negative number.");
      setUpdating(false);
      return;
    }

    if (isNaN(lowStock) || lowStock < 0) {
      setEditError("Low stock threshold must be a non-negative number.");
      setUpdating(false);
      return;
    }

    const updatedData = {
      name,
      currentStock,
      lowStock,
    };

    startTransition(async () => {
      onEditOptimistic(editingItem.id, updatedData);
      setEditingItem(null);

      try {
        const res = await fetch(`/api/routes/item/${editingItem.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to update product");
        }

        toast.success("Product updated successfully!");
        router.refresh();
      } catch (err: any) {
        console.error("Update product error:", err);
        setEditError(err.message || "Something went wrong.");
        toast.error(err.message || "Something went wrong.");
        router.refresh();
      } finally {
        setUpdating(false);
      }
    });
  }

  function closeEditModal() {
    setEditingItem(null);
    setEditError(null);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Item Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Quantity in Stock
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Low Threshold
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Date Added
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                Action
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => {
              const isLowStock = item.currentStock <= item.lowStock;
              const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <tr key={item.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">{item.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center rounded-lg bg-[#0b7a75]/10 px-3 py-1 text-sm font-semibold text-brand-primary">
                      {item.currentStock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-700">{item.lowStock}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-500">{formattedDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-brand-primary/5 hover:text-brand-primary"
                        title="Edit product"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(item.id)}
                        disabled={deletingId === item.id}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                        title="Delete product"
                      >
                        {deletingId === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        isLowStock
                          ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      }`}
                    >
                      {isLowStock ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <div className="flex items-center justify-center px-6 py-12">
          <p className="text-sm text-slate-500">No inventory records found.</p>
        </div>
      )}

      <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
        <p className="text-xs text-slate-600">
          Total records:{" "}
          <span className="font-semibold text-slate-900">{items.length}</span>
        </p>
      </div>

      {/* Edit Product Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
            aria-hidden="true"
            onClick={() => !updating && closeEditModal()}
          />

          <div
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/10"
            style={{ animation: "modal-enter 240ms ease-out forwards" }}
          >
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold">Edit Product</h2>
                <p className="mt-1 text-xs text-slate-600">
                  Update inventory metadata and status levels.
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                disabled={updating}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer disabled:opacity-50"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4 px-6 py-5">
              {editError && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-lg text-sm">
                  {editError}
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="edit-name" className="block text-sm font-medium text-slate-700">
                  Product Name
                </label>
                <input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Eg organic coffee"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  disabled={updating}
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="edit-stock" className="block text-sm font-medium text-slate-700">
                  Quantity in Stock
                </label>
                <input
                  id="edit-stock"
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  disabled={updating}
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="edit-threshold" className="block text-sm font-medium text-slate-700">
                  Low Stock Threshold
                </label>
                <input
                  id="edit-threshold"
                  value={editThreshold}
                  onChange={(e) => setEditThreshold(e.target.value)}
                  placeholder="5"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  disabled={updating}
                  required
                />
              </div>

              <div className="mt-6 flex flex-col gap-2 pt-4 border-t border-slate-100 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={updating}
                  className="inline-flex justify-center rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex justify-center items-center gap-2 rounded-2xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {updating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal Form */}
      {showDeleteConfirm && (() => {
        const targetItem = items.find((i) => i.id === showDeleteConfirm);
        const name = targetItem?.name || "this product";

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 animate-in fade-in duration-150">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
              aria-hidden="true"
              onClick={() => setShowDeleteConfirm(null)}
            />

            <div
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/10 p-6 dark:bg-slate-900 dark:text-white"
              style={{
                animation: "modal-slide-in 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">Confirm Deletion</h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-950 dark:text-white">{name}</strong>?
                This action cannot be undone and will delete all related sales transactions.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  performDelete(showDeleteConfirm);
                }}
                className="mt-6 flex justify-end gap-3"
              >
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(null)}
                  className="rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 px-5 py-3 text-sm font-semibold transition active:scale-95 cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-red-600 text-white hover:bg-red-700 px-5 py-3 text-sm font-semibold transition active:scale-95 cursor-pointer shadow-md shadow-red-200 dark:shadow-none"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
