"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Eye, X, Loader2, Pencil } from "lucide-react";
import { toast } from "react-hot-toast";

interface ExpenseItem {
  id: string;
  description?: string | null;
  category: string;
  amount: any;
  createdAt: string | Date;
}

interface ExpenseCardProps {
  expense?: ExpenseItem[];
}

export default function ExpenseCard({ expense = [] }: ExpenseCardProps) {
  const router = useRouter();

  // Details Modal State
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);
  const [open, setOpen ] = useState(false)

  // Deleting Loading State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [description, setDescription]= useState("")
  const [category, setCategory]= useState("")
  const [amount, setAmount]= useState("")

  // Updating states
  const [updating, setUpdating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const displayExpense = expense;

  // Handle Delete Action
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/routes/expenses/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Expense deleted successfully!");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete expense.");
      }
    } catch (error) {
      console.error("Delete expense error:", error);
      toast.error("Network error: Could not delete expense.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleEdit(item: ExpenseItem) {
    setSelectedExpense(item);
    setDescription(item.description || "");
    setCategory(item.category || "");
    setAmount(String(item.amount || ""));
    setOpen(true);
  }

  async function handleUpdateExpense(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedExpense) return;

    setUpdating(true);
    setEditError(null);

    try {
      const res = await fetch(`/api/routes/expenses/${selectedExpense.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          category,
          amount: Number(amount),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update expense");
      }

      toast.success("Expense updated successfully!");
      setOpen(false);
      setSelectedExpense(null);
      router.refresh();
    } catch (err: any) {
      console.error("Update expense error:", err);
      setEditError(err.message || "Something went wrong.");
      toast.error(err.message || "Something went wrong.");
    } finally {
      setUpdating(false);
    }
  }

  function closeEditModal() {
    setOpen(false);
    setSelectedExpense(null);
    setEditError(null);
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Category
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
            {displayExpense.map((item) => {
              const descriptionText = item.description || "No Description";
              const amountValue = Number(item.amount || 0);

              let formattedDate = "";
              if (item.createdAt && !isNaN(Date.parse(String(item.createdAt)))) {
                formattedDate = new Date(item.createdAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                });
              }

              const isDeleting = deletingId === item.id;

              return (
                <tr key={item.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">
                      {descriptionText}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center rounded-lg bg-[#0b7a75]/10 px-3 py-1 text-sm font-semibold text-[#0b7a75]">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900">
                      ₦{amountValue.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-500">{formattedDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedExpense(item)}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-[#0b7a75]/5 hover:text-[#0b7a75] disabled:opacity-50 cursor-pointer"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-blue-500 disabled:opacity-50 cursor-pointer"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4"/>
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

      {displayExpense.length === 0 && (
        <div className="flex items-center justify-center px-6 py-12">
          <p className="text-sm text-slate-500">No expense records found.</p>
        </div>
      )}

      {/* Footer statistics */}
      <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
        <p className="text-xs text-slate-600">
          Total records:{" "}
          <span className="font-semibold text-slate-900">
            {displayExpense.length}
          </span>
        </p>
      </div>

      {/* Dynamic View Expense Details Modal */}
      {selectedExpense && !open && (() => {
        const descriptionText = selectedExpense.description || "No Description";
        const amountValue = Number(selectedExpense.amount || 0);

        let formattedDate = "";
        if (selectedExpense.createdAt && !isNaN(Date.parse(String(selectedExpense.createdAt)))) {
          formattedDate = new Date(selectedExpense.createdAt).toLocaleString(undefined, {
            dateStyle: "long",
            timeStyle: "medium",
          });
        }

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 animate-in fade-in duration-150">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
              aria-hidden="true"
              onClick={() => setSelectedExpense(null)}
            />

            <div
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/10"
              style={{
                animation: "modal-slide-in 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Expense Details</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    ID: {selectedExpense.id}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedExpense(null)}
                  className="rounded-full p-2 text-slate-500 transition duration-200 hover:bg-slate-100 hover:text-slate-900 hover:rotate-90 cursor-pointer"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 py-6 space-y-4">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Description</span>
                  <span className="text-sm font-semibold text-slate-900">{descriptionText}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Category</span>
                  <span className="inline-flex items-center justify-center rounded-lg bg-[#0b7a75]/10 px-2.5 py-0.5 text-xs font-semibold text-[#0b7a75]">
                    {selectedExpense.category}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500 font-medium">Amount</span>
                  <span className="text-base font-bold text-red-600">₦{amountValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-slate-500">Time Saved</span>
                  <span className="text-xs text-slate-700">{formattedDate}</span>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedExpense(null)}
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

      {/* Edit Expense Modal */}
      {open && selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 animate-in fade-in duration-150">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => !updating && closeEditModal()}
          />

          <div
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/10"
            style={{ animation: "modal-enter 240ms ease-out forwards" }}
          >
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Edit Expense</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Update details for Expense ID: {selectedExpense.id}
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                disabled={updating}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateExpense} className="space-y-5 px-6 py-6">
              {editError && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-lg text-sm">
                  {editError}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="edit-desc" className="block text-sm font-medium text-slate-700">
                  Description
                </label>
                <input
                  id="edit-desc"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-[#0b7a75]"
                  disabled={updating}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="edit-cat" className="block text-sm font-medium text-slate-700">
                    Category
                  </label>
                  <input
                    id="edit-cat"
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-[#0b7a75]"
                    disabled={updating}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-amt" className="block text-sm font-medium text-slate-700">
                    ₦ Amount
                  </label>
                  <input
                    id="edit-amt"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-[#0b7a75]"
                    disabled={updating}
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-slate-200 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={updating}
                  className="inline-flex justify-center rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex justify-center items-center gap-2 rounded-2xl bg-[#0b7a75] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#09615e] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {updating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Expense"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
