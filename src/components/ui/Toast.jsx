import { AnimatePresence } from "motion/react";
import { CheckCircle, AlertCircle, X, Info } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const variants = {
    success: {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      bg: "bg-green-50",
      border: "border-green-100",
      progress: "bg-green-500",
    },
    error: {
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      bg: "bg-red-50",
      border: "border-red-100",
      progress: "bg-red-500",
    },
    info: {
      icon: <Info className="h-5 w-5 text-blue-500" />,
      bg: "bg-blue-50",
      border: "border-blue-100",
      progress: "bg-blue-500",
    },
  };

  const style = variants[type] || variants.success;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`fixed bottom-8 right-8 z-200 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border ${style.bg} ${style.border} min-w-[300px] overflow-hidden`}
    >
      <div className="shrink-0">{style.icon}</div>
      <div className="flex-1">
        <p className="text-sm font-bold text-[#2B3674]">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 hover:bg-black/5 rounded-lg transition-colors text-gray-400"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Progress Bar */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-1 ${style.progress}`}
      />
    </motion.div>
  );
};

export default Toast;
