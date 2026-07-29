"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus} from "lucide-react";

export default function ExpenseForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setcategory] = useState("");
  const [amount, setAmount] = useState(0);

  function resetForm() {
    setDescription("");
    setcategory("");
    setAmount(0);
  }

  async function handleSave(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const sale = { description, category, amount };
    const res = await fetch("api/routes/expenses", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(sale)
    })
    const data = await res.json()
    if(!res.ok){
      throw new Error(`${data.message} || failed to save expenses`)
    }

    console.log("Save sales", sale);
    setOpen(false);
    resetForm();
    router.refresh();
  }

  return (
    <div className="px-4 py-6">
      <div >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-full bg-brand-primary px-2 md:px-5 py-3  text-sm font-semibold text-white shadow-sm transition hover:bg-[#09615e] focus:outline-none focus:ring-2 focus:ring-brand-primary/50 cursor-pointer"
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
            onClick={() => setOpen(false)}
            
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
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
              {/* expense form */}
              <form onSubmit={handleSave} className="space-y-5 px-6 py-6">
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
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-slate-700"
                    >
                      category
                    </label>
                    <input
                      id="category"
                      type="text"
                      value={category}
                      placeholder="category"
                      onChange={(e) => setcategory(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#0b7a75] focus:ring-2 focus:ring-[#0b7a75]/20"
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
                      // min={0}
                      // step={0.01}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#0b7a75] focus:ring-2 focus:ring-[#0b7a75]/20"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-slate-200  sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setOpen(false);
                    }}
                    className="inline-flex justify-center rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-2xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary cursor-pointer"
                  >
                    Save Expense
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
