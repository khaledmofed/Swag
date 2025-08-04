import React from "react";

const sortOptions = [
  { value: "default", label: "Default", order: "", orderby: "" },
  { value: "newest", label: "Newest", order: "created_at", orderby: "desc" },
  { value: "oldest", label: "Oldest", order: "created_at", orderby: "asc" },
  {
    value: "highest_price",
    label: "Highest Price",
    order: "price",
    orderby: "desc",
  },
  {
    value: "lowest_price",
    label: "Lowest Price",
    order: "price",
    orderby: "asc",
  },
  // {
  //   value: "highest_rated",
  //   label: "Highest Rated",
  //   order: "rate",
  //   orderby: "desc",
  // },
  // {
  //   value: "lowest_rated",
  //   label: "Lowest Rated",
  //   order: "rate",
  //   orderby: "asc",
  // },
];

const orderByOptions = [
  { value: "asc", label: "Ascending (A-Z)", icon: "↑" },
  { value: "desc", label: "Descending (Z-A)", icon: "↓" },
];

// دالة مساعدة للحصول على معاملات الترتيب
const getSortParams = (selectedValue: string, selectedOrderBy: string) => {
  const option = sortOptions.find((opt) => opt.value === selectedValue);
  return {
    order: option?.order || "",
    orderby: option?.orderby || selectedOrderBy,
  };
};

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
  const [tempSelected, setTempSelected] = React.useState(selected);
  const [tempOrderBy, setTempOrderBy] = React.useState("desc");

  // تحديث tempSelected و tempOrderBy عند تغيير selected
  React.useEffect(() => {
    try {
      const parsed = JSON.parse(selected);
      // البحث عن الخيار المناسب بناءً على order و orderby
      const matchingOption = sortOptions.find(
        (opt) => opt.order === parsed.order && opt.orderby === parsed.orderby
      );
      setTempSelected(matchingOption?.value || "default");
      setTempOrderBy(parsed.orderby || "desc");
    } catch {
      setTempSelected(selected);
      setTempOrderBy("desc");
    }
  }, [selected]);
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
          {/* Sort By Section */}
          <div className="mb-6">
            {/* <h3 className="text-lg font-sukar font-semibold text-[#5C5C5C] dark:text-gray-200 mb-3">
              Sort By
            </h3> */}
            <ul className="flex flex-col gap-2">
              {sortOptions.map((option) => (
                <li key={option.value}>
                  <button
                    className={`w-full text-left py-3 px-4 text-md font-sukar transition rounded-none border ${
                      tempSelected === option.value
                        ? "text-[#607A76] dark:text-primary-300 font-bold border-[#607A76] bg-[#F7F9F9] dark:bg-[#2d3535]"
                        : "text-[#5C5C5C] dark:text-gray-300 hover:text-[#607A76] dark:hover:text-primary-300 border-gray-200 dark:border-gray-700 hover:border-[#607A76]"
                    }`}
                    onClick={() => setTempSelected(option.value)}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Order By Section */}
          {/* <div className="mb-6">
            <h3 className="text-lg font-sukar font-semibold text-[#5C5C5C] dark:text-gray-200 mb-3">
              Order Direction
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {orderByOptions.map((option) => (
                <button
                  key={option.value}
                  className={`py-3 px-4 text-md font-sukar transition rounded-none border flex items-center justify-center gap-2 ${
                    tempOrderBy === option.value
                      ? "text-[#607A76] dark:text-primary-300 font-bold border-[#607A76] bg-[#F7F9F9] dark:bg-[#2d3535]"
                      : "text-[#5C5C5C] dark:text-gray-300 hover:text-[#607A76] dark:hover:text-primary-300 border-gray-200 dark:border-gray-700 hover:border-[#607A76]"
                  }`}
                  onClick={() => setTempOrderBy(option.value)}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div> */}
        </div>
        {/* Footer */}
        <div className="border-t border-gray-100 dark:border-gray-800 p-4 bg-white dark:bg-[#232b2b]">
          <button
            className="w-full py-3 text-md font-sukar font-semibold rounded-none bg-gradient-to-r from-[#607A76] to-[#d1d5db] dark:from-primary-700 dark:to-gray-700 text-[#222] dark:text-white hover:opacity-90 transition"
            onClick={() => {
              // إرسال القيم المحددة معاً
              const sortParams = getSortParams(tempSelected, tempOrderBy);
              console.log("Selected:", tempSelected, "OrderBy:", tempOrderBy);
              console.log("Sort Params:", sortParams);
              onSelect(JSON.stringify(sortParams));
              onApply();
            }}
          >
            Apply
          </button>
        </div>
      </aside>
    </div>
  );
}
