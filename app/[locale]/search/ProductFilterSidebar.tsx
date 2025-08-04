import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/common/Icon";
import Slider from "@mui/material/Slider";

export function ProductFilterSidebar({
  open,
  onClose,
  onApply,
  currentFilters,
}: {
  open: boolean;
  onClose: () => void;
  onApply?: (filters: any) => void;
  currentFilters?: any;
}) {
  if (!open) return null;
  const MIN = 0;
  const MAX = 100000;
  const [values, setValues] = React.useState([0, 100000]);
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValues(newValue as number[]);
  };
  const [weight, setWeight] = React.useState(0);
  const [productName, setProductName] = React.useState("");
  const [selectedKarat, setSelectedKarat] = React.useState<string[]>([]);
  const [selectedMetal, setSelectedMetal] = React.useState("");
  const [selectedGender, setSelectedGender] = React.useState("");
  const [selectedOccasion, setSelectedOccasion] = React.useState("");
  const [selectedStone, setSelectedStone] = React.useState("");
  const [selectedPattern, setSelectedPattern] = React.useState("");

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setWeight(isNaN(val) ? 0 : val);
  };
  const incrementWeight = () =>
    setWeight((w) => parseFloat((w + 0.01).toFixed(2)));
  const decrementWeight = () =>
    setWeight((w) => Math.max(0, parseFloat((w - 0.01).toFixed(2))));

  const handleKaratChange = (karat: string) => {
    setSelectedKarat((prev) =>
      prev.includes(karat) ? prev.filter((k) => k !== karat) : [...prev, karat]
    );
  };

  const handleMetalChange = (metal: string) => {
    setSelectedMetal(metal);
  };

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
  };

  const handleOccasionChange = (occasion: string) => {
    setSelectedOccasion(occasion);
  };

  const handleStoneChange = (stone: string) => {
    setSelectedStone(stone);
  };

  const handlePatternChange = (pattern: string) => {
    setSelectedPattern(pattern);
  };

  const handleApply = () => {
    const filters = {
      name: productName,
      karat: selectedKarat.length > 0 ? selectedKarat.join(",") : undefined,
      metal: selectedMetal || undefined,
      gender: selectedGender || undefined,
      occasion: selectedOccasion || undefined,
      weight: weight > 0 ? weight : undefined,
      price_from: values[0],
      price_to: values[1],
    };

    onApply?.(filters);
    onClose();
  };

  const handleClearAll = () => {
    setProductName("");
    setSelectedKarat([]);
    setSelectedMetal("");
    setSelectedGender("");
    setSelectedOccasion("");
    setSelectedStone("");
    setSelectedPattern("");
    setWeight(0);
    setValues([0, 100000]);

    // إرسال فلاتر فارغة لإعادة تعيين البحث
    const emptyFilters = {
      name: undefined,
      karat: undefined,
      metal: undefined,
      gender: undefined,
      occasion: undefined,
      weight: undefined,
      price_from: 0,
      price_to: 100000,
    };

    onApply?.(emptyFilters);
  };

  // تعيين الفلاتر الحالية عند فتح السايد بار
  React.useEffect(() => {
    if (open && currentFilters) {
      setProductName(currentFilters.name || "");
      setSelectedKarat(
        currentFilters.karat ? currentFilters.karat.split(",") : []
      );
      setSelectedMetal(currentFilters.metal || "");
      setSelectedGender(currentFilters.gender || "");
      setSelectedOccasion(currentFilters.occasion || "");
      setWeight(currentFilters.weight || 0);
      setValues([
        currentFilters.price_from || 0,
        currentFilters.price_to || 100000,
      ]);
    }
  }, [open, currentFilters]);
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
        className="relative ml-auto w-full max-w-[380px] h-full bg-white dark:bg-[#232b2b] shadow-2xl flex flex-col transition-transform duration-300 animate-in slide-in-from-right overflow-hidden font-sukar z-50 border-l border-gray-100 dark:border-gray-800"
        style={{ boxShadow: "0 0 32px 0 rgba(0,0,0,0.10)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-sukar font-semibold text-[#607A76] dark:text-gray-100">
            Refine Results
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[#607A76] dark:text-gray-300"
          >
            <Icon name="x" size={22} />
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-[#d1d5db] dark:scrollbar-thumb-[#444] scrollbar-track-transparent">
          {/* Product Name */}
          <div className="mb-6">
            <label className="block text-md font-sukar mb-2 text-[#5C5C5C] dark:text-gray-200">
              Product Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Search for your favorite jewelry pieces"
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#232b2b] rounded-none px-3 py-3 text-md focus:outline-none focus:ring-2 focus:ring-primary-100 text-[#5C5C5C] dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
          {/* Choose Karat */}
          <div className="mb-6">
            <label className="block text-md font-sukar mb-2 text-[#5C5C5C] dark:text-gray-200">
              Choose Karat
            </label>
            <div className="flex gap-4">
              {["24", "21", "18"].map((k) => (
                <label
                  key={k}
                  className="flex items-center gap-1 cursor-pointer text-[#5C5C5C] dark:text-gray-200"
                >
                  <input
                    type="checkbox"
                    className="accent-[#607A76]"
                    checked={selectedKarat.includes(k)}
                    onChange={() => handleKaratChange(k)}
                  />
                  <span className="text-base font-sukar">{k} K</span>
                </label>
              ))}
            </div>
          </div>
          {/* Set Your Budget */}
          <div className="mb-6">
            <label className="block text-md font-sukar mb-2 text-[#5C5C5C] dark:text-gray-200">
              Set Your Budget
            </label>
            <div className="flex flex-col items-center gap-2 mb-2 px-1">
              <Slider
                value={values}
                onChange={handleSliderChange}
                min={MIN}
                max={MAX}
                step={10}
                valueLabelDisplay="off"
                sx={{
                  color: "#607A76",
                  height: 8,
                  padding: "24px 0 8px 0",
                  "& .MuiSlider-thumb": {
                    height: 30,
                    width: 30,
                    border: "3px solid #607A76",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 8px 0 rgba(96,122,118,0.08)",
                  },
                  "& .MuiSlider-rail": {
                    color: "#e5eae9",
                    opacity: 1,
                    height: 8,
                    borderRadius: 4,
                  },
                  "& .MuiSlider-track": {
                    color: "#607A76",
                    height: 8,
                    borderRadius: 4,
                  },
                }}
              />
            </div>
            <div
              className="mt-2 flex items-center gap-1"
              style={{ color: "#5C5C5C", fontSize: 12 }}
            >
              Prices: {values[0]} - {values[1]}
              <svg
                id="Layer_1"
                className="inline-block fill-gray-400 customeSize"
                width="18"
                height="18"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1124.14 1256.39"
              >
                <path
                  className="cls-1"
                  d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"
                ></path>
                <path
                  className="cls-1"
                  d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"
                ></path>
              </svg>
            </div>
          </div>
          {/* Weight */}
          <div className="mb-6">
            <label className="block text-md font-sukar mb-2 text-[#5C5C5C] dark:text-gray-200">
              Weight ( g.mg)
            </label>
            <div className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#232b2b] rounded-none flex items-center px-2 py-1">
              <button
                type="button"
                onClick={incrementWeight}
                className="flex items-center justify-center w-12 h-8 text-2xl text-[#607A76] hover:bg-[#F7F9F9] dark:hover:bg-[#2d3535] transition rounded-none"
                tabIndex={-1}
              >
                <span className="font-sukar">+</span>
              </button>
              <input
                type="number"
                step="0.01"
                min={0}
                value={weight.toFixed(2)}
                onChange={handleWeightChange}
                className="flex-1 text-center border-none outline-none bg-transparent text-[#5C5C5C] dark:text-gray-100 text-md font-sukar font-normal px-2"
                style={{ minWidth: 60 }}
              />
              <button
                type="button"
                onClick={decrementWeight}
                className="flex items-center justify-center w-12 h-8 text-2xl text-[#607A76] hover:bg-[#F7F9F9] dark:hover:bg-[#2d3535] transition rounded-none"
                tabIndex={-1}
              >
                <span className="font-sukar">-</span>
              </button>
            </div>
          </div>
          {/* Select Metal */}
          <div className="mb-6">
            <label className="block text-md font-sukar mb-2 text-[#5C5C5C] dark:text-gray-200">
              Select Metal
            </label>
            <div className="flex flex-col gap-1">
              {["Gold", "Silver", "Platinum"].map((m) => (
                <label
                  key={m}
                  className="cursor-pointer text-base font-sukar text-[#5C5C5C] dark:text-gray-200"
                >
                  <input
                    type="radio"
                    name="metal"
                    className="accent-[#607A76] mr-2"
                    checked={selectedMetal === m}
                    onChange={() => handleMetalChange(m)}
                  />
                  {m}
                </label>
              ))}
            </div>
          </div>
          {/* Select Gender */}
          <div className="mb-6">
            <label className="block text-md font-sukar mb-2 text-[#5C5C5C] dark:text-gray-200">
              Select Gender
            </label>
            <div className="flex flex-col gap-1">
              {["Woman", "Children"].map((g) => (
                <label
                  key={g}
                  className="cursor-pointer text-base font-sukar text-[#5C5C5C] dark:text-gray-200"
                >
                  <input
                    type="radio"
                    name="gender"
                    className="accent-[#607A76] mr-2"
                    checked={selectedGender === g}
                    onChange={() => handleGenderChange(g)}
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>
          {/* Occasion */}
          <div className="mb-6">
            <label className="block text-md font-sukar mb-2 text-[#5C5C5C] dark:text-gray-200">
              Occasion
            </label>
            <div className="flex flex-col gap-1">
              {["Wedding", "Gift", "Graduation", "Newborn", "Other"].map(
                (o) => (
                  <label
                    key={o}
                    className="cursor-pointer text-base font-sukar text-[#5C5C5C] dark:text-gray-200"
                  >
                    <input
                      type="radio"
                      name="occasion"
                      className="accent-[#607A76] mr-2"
                      checked={selectedOccasion === o}
                      onChange={() => handleOccasionChange(o)}
                    />
                    {o}
                  </label>
                )
              )}
            </div>
          </div>
          {/* Stone Shape */}
          <div className="mb-6">
            <label className="block text-md font-sukar mb-2 text-[#5C5C5C] dark:text-gray-200">
              Stone Shape
            </label>
            <div className="flex flex-col gap-1">
              {["Oval", "Square", "No Stone"].map((s) => (
                <label
                  key={s}
                  className="cursor-pointer text-base font-sukar text-[#5C5C5C] dark:text-gray-200"
                >
                  <input
                    type="radio"
                    name="stone"
                    className="accent-[#607A76] mr-2"
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>
          {/* Pattern Style */}
          <div className="mb-6">
            <label className="block text-md font-sukar mb-2 text-[#5C5C5C] dark:text-gray-200">
              Pattern Style
            </label>
            <div className="flex flex-col gap-1">
              {["Classic", "Arabic", "Modern", "Italian"].map((p) => (
                <label
                  key={p}
                  className="cursor-pointer text-base font-sukar text-[#5C5C5C] dark:text-gray-200"
                >
                  <input
                    type="radio"
                    name="pattern"
                    className="accent-[#607A76] mr-2"
                  />
                  {p}
                </label>
              ))}
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="flex gap-2 border-t border-gray-100 dark:border-gray-800 p-4 bg-white dark:bg-[#232b2b]">
          <Button
            variant="ghost"
            className="text-md w-1/3 bg-[#F7F9F9] dark:bg-[#232b2b] text-[#607A76] dark:text-gray-200 font-sukar font-semibold rounded-none border border-gray-100 dark:border-gray-800"
            onClick={() => {
              handleClearAll();
              // لا نغلق السايد بار عند الضغط على Clear All
            }}
          >
            Clear All
          </Button>
          <Button
            variant="ghost"
            className="text-md w-1/3 bg-[#F7F9F9] dark:bg-[#232b2b] text-[#607A76] dark:text-gray-200 font-sukar font-semibold rounded-none border border-gray-100 dark:border-gray-800"
            onClick={() => {
              // تفريغ الحقول فقط بدون إرسال فلاتر فارغة
              setProductName("");
              setSelectedKarat([]);
              setSelectedMetal("");
              setSelectedGender("");
              setSelectedOccasion("");
              setSelectedStone("");
              setSelectedPattern("");
              setWeight(0);
              setValues([0, 100000]);
            }}
          >
            Reset Fields
          </Button>
          <Button
            className="text-md w-1/3 bg-[#607A76] dark:bg-primary-700 text-white font-sukar font-semibold rounded-none"
            onClick={handleApply}
          >
            Show Results
          </Button>
        </div>
      </aside>
    </div>
  );
}
