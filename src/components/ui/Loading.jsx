import { motion } from "motion/react";

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200/60 ${className}`}
      {...props}
    />
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full space-y-4">
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="flex items-center space-x-4 px-6 py-4 border-b border-gray-50 last:border-0"
        >
          {[...Array(cols)].map((_, j) => (
            <Skeleton
              key={j}
              className={`h-4 ${j === 0 ? "w-8" : "w-full"} flex-1`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-4 border-[#4318FF]/20 border-t-[#4318FF] rounded-full shadow-sm"
      />
    </div>
  );
};

export const LoadingOverlay = () => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-xs rounded-[20px]">
      <LoadingSpinner />
    </div>
  );
};
