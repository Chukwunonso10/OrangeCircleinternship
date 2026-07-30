"use client";

import { useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Loader2 } from "lucide-react";

interface ExpenseFormProps {
  onAddOptimistic: (newExpense: any) => void;
}

export default function ExpenseForm({ onAddOptimistic }: ExpenseFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function resetForm() {
    setDescription("");
    setCategory("");
    setAmount(0);
    setErrorMsg(null);
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg(null);

    const expenseAmount = Number(amount);
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      setErrorMsg("Amount must be a positive number.");
      return;
    }

    setSubmitting(true);

    const tempId = `temp-${Date.now()}`;
    const newOptimisticExpense = {
      id: tempId,
      description: description.trim() || null,
      category: category.trim(),
      amount: expenseAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Cache current state for rollback
    const cachedDescription = description;
    const cachedCategory = category;
    const cachedAmount = amount;

    startTransition(async () => {
      onAddOptimistic(newOptimisticExpense);
      setOpen(false);
      resetForm();

      try {
        const res = await fetch("/api/routes/expenses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: cachedDescription,
            category: cachedCategory,
            amount: expenseAmount,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "failed to save expenses");
        }

        router.refresh();
      } catch (err: any) {
        console.error("Save expense error:", err);
        setOpen(true);
        setDescription(cachedDescription);
        setCategory(cachedCategory);
        setAmount(cachedAmount);
        setErrorMsg(err.message || "Something went wrong.");
      } finally {
        setSubmitting(false);
      }
    });
  }

  return (
    <div className="px-4 py-6">
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-full bg-brand-primary px-2 md:px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#09615e] focus:outline-none focus:ring-2 focus:ring-brand-primary/50 cursor-pointer"
        >
          <Plus size={18} />
          <span className="px-1 ">Add</span>
          Expense
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => !submitting && setOpen(false)}
          />

          <div
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/10 "
            style={{ animation: "modal-enter 240ms ease-out forwards" }}
          >
            <div className="transform rounded-3xl transition duration-300 ease-out scale-100 opacity-100">
              <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Add Expense</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Fill description, category, and amount to save an expense.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => !submitting && setOpen(false)}
                  disabled={submitting}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer disabled:opacity-50"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* expense form */}
              <form onSubmit={handleSave} className="space-y-5 px-6 py-6">
                {errorMsg && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-lg text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Description
                  </label>
                  <input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#0b7a75] focus:ring-2 focus:ring-[#0b7a75]/20"
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Category
                    </label>
                    <input
                      id="category"
                      type="text"
                      value={category}
                      placeholder="Category"
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#0b7a75] focus:ring-2 focus:ring-[#0b7a75]/20"
                      disabled={submitting}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-slate-700"
                    >
                      ₦ Amount
                    </label>
                    <input
                      id="amount"
                      type="number"
                      placeholder="0"
                      value={amount || ""}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#0b7a75] focus:ring-2 focus:ring-[#0b7a75]/20"
                      disabled={submitting}
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-slate-200 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setOpen(false);
                    }}
                    disabled={submitting}
                    className="inline-flex justify-center rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex justify-center items-center gap-2 rounded-2xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
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
        </div>
      )}
    </div>
  );
}
