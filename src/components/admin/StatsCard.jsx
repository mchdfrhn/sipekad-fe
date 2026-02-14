import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  className,
  description,
  variant = "default",
}) => {
  const variants = {
    default: "bg-[#F4F7FE] text-[#4318FF]", // Light Blue/Purple tint
    purple: "bg-[#F3E8FF] text-[#A855F7]",
    green: "bg-[#E6F9F0] text-[#059669]",
    orange: "bg-[#FFF9E6] text-[#D97706]",
    red: "bg-[#FDEDEF] text-[#DC2626]",
    blue: "bg-[#E6EBF9] text-[#4318FF]",
  };

  const iconBgClass = variants[variant] || variants.default;

  return (
    <Card
      className={cn(
        "border-none shadow-sm card-shadow rounded-[20px]",
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
          <p className="text-sm font-medium text-[#A3AED0]">{title}</p>
          <h3 className="text-2xl font-bold text-[#2B3674]">{value}</h3>
          {description && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs font-bold text-green-500 flex items-center">
                +2.4%
              </span>
              <span className="text-xs text-[#A3AED0]">since last month</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
