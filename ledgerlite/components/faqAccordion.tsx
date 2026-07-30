"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import data from "./accordian";

export default function FAQAccordion() {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSingleSelection = (getCurrentId: number) => {
    setSelected(getCurrentId === selected ? null : getCurrentId);
  };

  return (
    <div className="w-full py-10">
      {data && data.length > 0 ? (
        data.map((dataItem) => (
          <div
            key={dataItem.id}
            className="border border-gray-200 rounded-2xl mb-3 last:mb-0"
          >
            <div>
              <div
                onClick={() => handleSingleSelection(dataItem.id)}
                className="flex justify-between font-semibold items-center cursor-pointer p-4"
              >
                <h3 className="text-md text-gray-700">
                  {dataItem.question}
                </h3>
                <span className="text-2xl text-gray-700">
                  {selected === dataItem.id ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </span>
              </div>
              {selected === dataItem.id ? (
                <div className="text-gray-700 pb-4 px-4 pt-1 border-t border-gray-50/50">
                  {dataItem.answer}
                </div>
              ) : null}
            </div>
          </div>
        ))
      ) : (
        <div>No Data Found</div>
      )}
    </div>
  );
}
