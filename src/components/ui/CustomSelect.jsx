import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between px-4 py-3 bg-[#F4F7FE] text-[#2B3674] font-semibold rounded-2xl transition-all duration-200 focus:ring-2 focus:ring-[#4318FF] outline-none",
          isOpen && "ring-2 ring-[#4318FF]",
        )}
      >
        <span
          className={cn(
            "capitalize",
            !selectedOption && "text-gray-400 font-normal",
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-gray-400 transition-transform duration-200",
            isOpen && "transform rotate-180 text-[#4318FF]",
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-120 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto py-1">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "px-4 py-2.5 text-sm font-semibold cursor-pointer transition-colors duration-200 capitalize",
                    value === option.value
                      ? "bg-indigo-50 text-[#4318FF]"
                      : "text-[#2B3674] hover:bg-gray-50",
                  )}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
