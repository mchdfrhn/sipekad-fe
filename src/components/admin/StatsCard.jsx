import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion as Motion } from "motion/react";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  className,
  description,
  variant = "default",
  onClick,
}) => {
  const iconBgVariants = {
    default: "bg-[#F4F7FE] text-[#4318FF]",
    purple: "bg-[#F3E8FF] text-[#A855F7]",
    green: "bg-[#E6F9F0] text-[#059669]",
    orange: "bg-[#FFF9E6] text-[#D97706]",
    red: "bg-[#FDEDEF] text-[#DC2626]",
    blue: "bg-[#E6EBF9] text-[#4318FF]",
    premium: "bg-white/20 text-white",
  };

  const accentColors = {
    default: "#4318FF",
    purple: "#A855F7",
    green: "#059669",
    orange: "#D97706",
    red: "#DC2626",
    blue: "#4318FF",
    premium: "#7C5FFF",
  };

  const isPremium = variant === "premium";
  const iconBgClass = iconBgVariants[variant] || iconBgVariants.default;
  const accentColor = accentColors[variant] || accentColors.default;

  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className={cn("relative overflow-hidden rounded-[20px]", className)}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[20px] z-10"
        style={{ backgroundColor: accentColor }}
      />

      <Card
        onClick={onClick}
        className={cn(
          "border border-gray-100/80 rounded-[20px] shadow-[0_4px_24px_rgba(67,24,255,0.06)] hover:shadow-[0_8px_32px_rgba(67,24,255,0.12)] transition-shadow duration-300 pl-1",
          onClick && "cursor-pointer",
          isPremium
            ? "text-white border-transparent"
            : "bg-white",
        )}
        style={
          isPremium
            ? { background: "linear-gradient(135deg, #4318FF, #7C5FFF)" }
            : undefined
        }
      >
        <CardContent className="p-4 flex items-center gap-4">
          {/* Square icon container */}
          <div
            className={cn(
              "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0",
              iconBgClass,
            )}
          >
            {Icon && <Icon className="h-7 w-7" />}
          </div>

          <div>
            <p
              className={cn(
                "text-sm font-medium",
                isPremium ? "text-white/80" : "text-[#718096]",
              )}
            >
              {title}
            </p>

            <Motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={cn(
                "text-2xl font-bold",
                isPremium ? "text-white" : "text-[#2B3674]",
              )}
            >
              {value}
            </Motion.h3>

            {description && (
              <span className="inline-block mt-1 bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {description}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Motion.div>
  );
};

export default StatsCard;
