import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  className,
  description,
  variant = "default",
  onClick,
}) => {
  const variants = {
    default: "bg-[#F4F7FE] text-[#4318FF]", // Light Blue/Purple tint
    purple: "bg-[#F3E8FF] text-[#A855F7]",
    green: "bg-[#E6F9F0] text-[#059669]",
    orange: "bg-[#FFF9E6] text-[#D97706]",
    red: "bg-[#FDEDEF] text-[#DC2626]",
    blue: "bg-[#E6EBF9] text-[#4318FF]",
    premium: "bg-white/20 text-white",
  };

  const cardBackgrounds = {
    default: "bg-white",
    premium: "bg-linear-to-br from-[#4318FF] to-[#b097ff] text-white",
  };

  const iconBgClass = variants[variant] || variants.default;

  return (
    <Card
      onClick={onClick}
      className={cn(
        "border-none shadow-sm card-shadow rounded-[20px] transition-all duration-300 hover:shadow-md",
        onClick && "cursor-pointer hover:scale-[1.02] active:scale-[0.99]",
        cardBackgrounds[variant] || cardBackgrounds.default,
        className,
      )}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div
          className={cn(
            "h-14 w-14 rounded-full flex items-center justify-center",
            iconBgClass,
          )}
        >
          {Icon && <Icon className="h-7 w-7" />}
        </div>
        <div>
          <p
            className={cn(
              "text-sm font-medium",
              variant === "premium" ? "text-white/80" : "text-[#A3AED0]",
            )}
          >
            {title}
          </p>
          <h3
            className={cn(
              "text-2xl font-bold",
              variant === "premium" ? "text-white" : "text-[#2B3674]",
            )}
          >
            {value}
          </h3>
          {description && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs font-bold text-green-500 flex items-center">
                +2.4%
              </span>
              <span className="text-xs text-[#A3AED0]">sejak bulan lalu</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
