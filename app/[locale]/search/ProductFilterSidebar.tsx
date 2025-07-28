import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/common/Icon";
import Slider from "@mui/material/Slider";

export function ProductFilterSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  const MIN = 250;
  const MAX = 5000;
  const [values, setValues] = React.useState([750, 3000]);
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValues(newValue as number[]);
  };
  const [weight, setWeight] = React.useState(0);
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setWeight(isNaN(val) ? 0 : val);
  };
  const incrementWeight = () =>
    setWeight((w) => parseFloat((w + 0.01).toFixed(2)));
  const decrementWeight = () =>
    setWeight((w) => Math.max(0, parseFloat((w - 0.01).toFixed(2))));
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
              {["24K", "22K", "21K", "18K"].map((k) => (
                <label
                  key={k}
                  className="flex items-center gap-1 cursor-pointer text-[#5C5C5C] dark:text-gray-200"
                >
                  <input type="checkbox" className="accent-[#607A76]" />
                  <span className="text-base font-sukar">{k}</span>
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
            <div className="mt-2" style={{ color: "#5C5C5C", fontSize: 12 }}>
              Prices: {values[0]} SAR - {values[1]} SAR
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
            className="text-md w-1/2 bg-[#F7F9F9] dark:bg-[#232b2b] text-[#607A76] dark:text-gray-200 font-sukar font-semibold rounded-none border border-gray-100 dark:border-gray-800"
          >
            Clear All
          </Button>
          <Button className="text-md w-1/2 bg-[#607A76] dark:bg-primary-700 text-white font-sukar font-semibold rounded-none">
            Show Results
          </Button>
        </div>
      </aside>
    </div>
  );
}
