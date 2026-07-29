"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Loader2 } from "lucide-react";

export default function SalesForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  
  // Form input states
  const [itemType, setItemType] = useState<"tracked" | "custom">("tracked");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [customItemName, setCustomItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  // UX states
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  

  // Fetch user's inventory items to choose from
  useEffect(() => {
    if (!open) return;
    
    setLoadingProducts(true);
    fetch("/api/routes/item")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const list = data.allProducts || [];
          setProducts(list);
          if (list.length > 0) {
            setSelectedItemId(list[0].id);
          } else {
            setItemType("custom");
          }
        } else {
          setItemType("custom");
        }
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setItemType("custom");
      })
      .finally(() => {
        setLoadingProducts(false);
      });
  }, [open]);

  function resetForm() {
    setItemType("tracked");
    setSelectedItemId(products[0]?.id || "");
    setCustomItemName("");
    setQuantity("");
    setUnitPrice("");
    setErrorMsg(null);
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    // Validate selections
    const itemId = itemType === "tracked" ? selectedItemId : null;
    const name = itemType === "custom" ? customItemName : null;

    if (itemType === "custom" && !name?.trim()) {
      setErrorMsg("Item name is required for custom sales.");
      setSubmitting(false);
      return;
    }
    if (itemType === "tracked" && !itemId) {
      setErrorMsg("Please select an item from your inventory.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/routes/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          customItemName: name,
          quantity: Number(quantity),
          unitPrice: Number(unitPrice),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setOpen(false);
        resetForm();
        router.refresh(); // Refresh Next.js Server Component data
      } else {
        setErrorMsg(result.message || "Failed to record sale.");
      }
    } catch (err: any) {
      setErrorMsg("Network error: Could not complete the transaction.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="px-4 py-6">
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-3 py-3 md:px-5 md:py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/20 transition duration-200 hover:bg-brand-primary hover:shadow-xl hover:shadow-brand-primary/30 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 cursor-pointer"
        >
          <Plus
            size={18}
            className="transition-transform duration-300 group-hover:rotate-90"
          />
          <span>Add</span>
          Sales
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 animate-in fade-in duration-150">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
            aria-hidden="true"
            onClick={() => !submitting && setOpen(false)}
          />

          <div
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/10 dark:bg-slate-900 dark:ring-white/10"
            style={{
              animation:
                "modal-slide-in 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            <div className="transform rounded-3xl transition duration-300 ease-out scale-100 opacity-100">
              <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 dark:border-zinc-800">
                <div>
                  <h2 className="text-xl font-semibold">Add Sales</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Fill item, quantity, and unit price to save a sale.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => !submitting && setOpen(false)}
                  disabled={submitting}
                  className="rounded-full p-2 text-slate-500 transition duration-200 hover:bg-slate-100 hover:text-slate-900 hover:rotate-90 dark:hover:bg-zinc-800 dark:hover:text-slate-100 cursor-pointer disabled:opacity-50"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* sales form */}
              <form onSubmit={handleSave} className="space-y-5 px-6 py-6">
                {errorMsg && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-lg text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    {errorMsg}
                  </div>
                )}

                {/* Tracked vs Custom Segmented Control */}
                {products.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Product Source
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl dark:bg-slate-800">
                      <button
                        type="button"
                        onClick={() => setItemType("tracked")}
                        className={`py-2 text-xs font-semibold rounded-lg transition duration-150 ${
                          itemType === "tracked"
                            ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                            : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
                        }`}
                      >
                        Tracked Inventory
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemType("custom")}
                        className={`py-2 text-xs font-semibold rounded-lg transition duration-150 ${
                          itemType === "custom"
                            ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                            : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
                        }`}
                      >
                        Custom / Untracked
                      </button>
                    </div>
                  </div>
                )}

                {/* Item Select / Input */}
                <div
                  className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 fill-mode-both"
                  style={{ animationDelay: "50ms" }}
                >
                  <label
                    htmlFor="item"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Item
                  </label>
                  
                  {itemType === "tracked" && products.length > 0 ? (
                    <select
                      id="item"
                      value={selectedItemId}
                      onChange={(e) => setSelectedItemId(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:shadow-md dark:border-zinc-700 dark:bg-slate-800 dark:text-slate-100"
                      disabled={loadingProducts || submitting}
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Stock: {p.currentStock})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="item"
                      type="text"
                      value={customItemName}
                      onChange={(e) => setCustomItemName(e.target.value)}
                      placeholder="Enter custom item name"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition duration-200 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:shadow-md dark:border-zinc-700 dark:bg-slate-800 dark:text-slate-100"
                      disabled={submitting}
                      required
                    />
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Quantity */}
                  <div
                    className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 fill-mode-both"
                    style={{ animationDelay: "100ms" }}
                  >
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Quantity
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      placeholder="0"
                      // min={1}
                      value={quantity}
                      onChange={(e) => setQuantity((e.target.value))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition duration-200 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:shadow-md dark:border-zinc-700 dark:bg-slate-800 dark:text-slate-100"
                      disabled={submitting}
                      required
                    />
                  </div>

                  {/* Unit Price */}
                  <div
                    className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 fill-mode-both"
                    style={{ animationDelay: "150ms" }}
                  >
                    <label
                      htmlFor="unitPrice"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Unit Price (₦)
                    </label>
                    <input
                      id="unitPrice"
                      type="number"
                      placeholder="0"
                      // min={0}
                      // step={0.01}
                      value={unitPrice}
                      onChange={(e) => setUnitPrice((e.target.value))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition duration-200 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:shadow-md dark:border-zinc-700 dark:bg-slate-800 dark:text-slate-100"
                      disabled={submitting}
                      required
                    />
                  </div>
                </div>

                {/* Submitting buttons */}
                <div
                  className="mt-6 flex flex-col gap-3 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both dark:border-zinc-800"
                  style={{ animationDelay: "200ms" }}
                >
                  <div className="flex sm:flex-row sm:justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setOpen(false);
                      }}
                      disabled={submitting}
                      className="inline-flex justify-center rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition duration-200 hover:bg-slate-100 hover:border-slate-400 active:scale-95 cursor-pointer dark:border-zinc-600 dark:text-slate-200 dark:hover:bg-slate-800 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex justify-center items-center gap-2 rounded-2xl bg-[#0b7a75] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0b7a75]/20 transition duration-200 hover:bg-[#09615e] hover:shadow-xl hover:shadow-brand-primary/30 active:scale-95 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save sales"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

