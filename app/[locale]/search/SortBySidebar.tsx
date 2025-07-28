import React from "react";

const sortOptions = [
  "Default",
  "Newest",
  "Oldest",
  "Highest Price",
  "Lowest Price",
  "Highest Rated",
  "Lowest Rated",
  "Seasonal",
];

export function SortBySidebar({
  open,
  onClose,
  selected,
  onSelect,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  selected: string;
  onSelect: (val: string) => void;
  onApply: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex font-sukar">
      {/* Overlay */}
      <div
        className="fixed inset-0 backdrop-blur-sm z-40 bg-black/20 dark:bg-black/40"
        style={{ background: "rgba(0,0,0,0.19)" }}
        onClick={onClose}
      />
      {/* Sidebar */}
      <aside
        className="relative ml-auto w-full max-w-[340px] h-full bg-white dark:bg-[#232b2b] shadow-2xl flex flex-col transition-transform duration-300 animate-in slide-in-from-right overflow-hidden font-sukar z-50 border-l border-gray-100 dark:border-gray-800"
        style={{ boxShadow: "0 0 32px 0 rgba(0,0,0,0.10)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-sukar font-semibold text-[#5C5C5C] dark:text-gray-100">
            Sort By
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[#607A76] dark:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-[#d1d5db] dark:scrollbar-thumb-[#444] scrollbar-track-transparent">
          <ul className="flex flex-col gap-2">
            {sortOptions.map((option) => (
              <li key={option}>
                <button
                  className={`w-full text-left py-2 px-1 text-md font-sukar transition rounded-none ${
                    selected === option
                      ? "text-[#607A76] dark:text-primary-300 font-bold"
                      : "text-[#5C5C5C] dark:text-gray-300 hover:text-[#607A76] dark:hover:text-primary-300"
                  }`}
                  onClick={() => onSelect(option)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Footer */}
        <div className="border-t border-gray-100 dark:border-gray-800 p-4 bg-white dark:bg-[#232b2b]">
          <button
            className="w-full py-3 text-md font-sukar font-semibold rounded-none bg-gradient-to-r from-[#607A76] to-[#d1d5db] dark:from-primary-700 dark:to-gray-700 text-[#222] dark:text-white hover:opacity-90 transition"
            onClick={onApply}
          >
            Apply
          </button>
        </div>
      </aside>
    </div>
  );
}
