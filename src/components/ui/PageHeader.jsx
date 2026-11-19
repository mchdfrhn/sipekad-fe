import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = {
  brand: "bg-[#4318FF]/10 text-[#4318FF]",
  green: "bg-green-50 text-green-600",
  orange: "bg-orange-50 text-orange-500",
  blue: "bg-blue-50 text-blue-600",
};

/**
 * Standard page title block. Rendering it hides the big title in the layout
 * header (see `data-page-header` in LayoutAdmin / LayoutDashboard), so a page
 * never shows its title twice.
 */
const PageHeader = ({ icon, tone = "brand", title, description, actions, backTo, backLabel = "Kembali", className }) => {
  const Icon = icon;
  return (
    <div data-page-header className={cn("mb-6 space-y-3", className)}>
      {backTo && (
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#718096] hover:text-[#4318FF] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div className={cn("h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center", TONES[tone] || TONES.brand)}>
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-[#2B3674] leading-tight">{title}</h1>
            {description && <p className="text-sm text-[#718096] mt-0.5">{description}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
