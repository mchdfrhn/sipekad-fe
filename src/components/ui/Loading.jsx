import { motion } from "motion/react";

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200/60 ${className}`}
      {...props}
    />
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <>
    {[...Array(rows)].map((_, i) => (
      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-indigo-50/10'}>
        {[...Array(cols)].map((__, j) => (
          <td key={j} className={`px-4 py-3 ${i % 2 === 0 ? 'opacity-100' : 'opacity-80'}`}>
            <div className={`h-4 rounded-full bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse ${j === 0 ? 'w-8' : j === cols - 1 ? 'w-16 mx-auto' : 'w-full'}`} />
          </td>
        ))}
      </tr>
    ))}
  </>
);

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
