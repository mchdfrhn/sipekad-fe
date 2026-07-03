import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, X } from "lucide-react";
import { Button } from "./button";
import { useEffect, useRef } from "react";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Batal",
  variant = "danger",
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    const focusable = () =>
      Array.from(dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )).filter((el) => !el.disabled);
    const t = setTimeout(() => { focusable()[0]?.focus(); }, 0);
    const trapTab = (e) => {
      if (e.key !== "Tab") return;
      const els = focusable();
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last?.focus(); } }
      else            { if (document.activeElement === last)  { e.preventDefault(); first?.focus(); } }
    };
    dialogRef.current.addEventListener("keydown", trapTab);
    const ref = dialogRef.current;
    return () => { clearTimeout(t); ref.removeEventListener("keydown", trapTab); };
  }, [isOpen]);

  if (!isOpen) return null;

  const variants = {
    danger: {
      icon: <AlertCircle className="h-6 w-6 text-red-500" />,
      button: "bg-red-500 hover:bg-red-600 text-white shadow-red-200",
      bg: "bg-red-50",
    },
    warning: {
      icon: <AlertCircle className="h-6 w-6 text-orange-500" />,
      button: "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200",
      bg: "bg-orange-50",
    },
    primary: {
      icon: <AlertCircle className="h-6 w-6 text-[#4318FF]" />,
      button: "bg-[#4318FF] hover:bg-[#3311CC] text-white shadow-indigo-200",
      bg: "bg-indigo-50",
    },
  };

  const currentVariant = variants[variant] || variants.primary;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-[400px] bg-white rounded-[20px] shadow-2xl overflow-hidden border border-gray-100"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          {/* Header */}
          <div className="flex justify-end p-4 pb-0">
            <button type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-8 pb-8 flex flex-col items-center text-center">
            {/* Icon Circle */}
            <div className={`p-4 rounded-[20px] mb-6 ${currentVariant.bg}`}>
              {currentVariant.icon}
            </div>

            <h3 id="confirm-dialog-title" className="text-xl font-extrabold text-[#2B3674] mb-2 px-2">
              {title}
            </h3>
            <p className="text-sm font-medium text-gray-500 leading-relaxed px-4">
              {description}
            </p>

            <div className="flex items-center gap-3 w-full mt-8">
              <Button
                variant="ghost"
                onClick={onClose}
                className="flex-1 rounded-2xl py-6 font-bold text-gray-500 hover:bg-gray-100 transition-all duration-300"
              >
                {cancelText}
              </Button>
              <Button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 rounded-2xl py-6 font-bold shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${currentVariant.button}`}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmDialog;
