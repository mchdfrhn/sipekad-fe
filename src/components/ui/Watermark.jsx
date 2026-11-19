import { useLocation } from "react-router";
import { Code2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Author credit. The style comes from VITE_WATERMARK_STYLE:
 *   subtle   — faint text, bottom centre
 *   pill     — white capsule with a </> icon, bottom centre
 *   gradient — brand-gradient badge, bottom centre (default)
 *   sidebar  — a line under "Laporkan Bug" in the admin/student sidebars;
 *              pages without a sidebar (login, home) fall back to `subtle`
 *   none     — hidden
 */
const URL = "https://www.mochamadfarhanali.my.id/";
const STYLES = ["subtle", "pill", "gradient", "sidebar", "none"];

const configured = String(import.meta.env.VITE_WATERMARK_STYLE || "gradient").trim().toLowerCase();
const WATERMARK_STYLE = STYLES.includes(configured) ? configured : "gradient";

const linkProps = { href: URL, target: "_blank", rel: "noopener noreferrer" };

// One inline element so flex containers don't swallow the space between the words.
const Label = () => (
  <span>
    Developed by <span className="font-bold">mchdfrhn</span>
  </span>
);

const FLOATING = "fixed bottom-3 left-1/2 -translate-x-1/2 z-40 inline-flex items-center gap-1.5 rounded-full text-[10px] tracking-wide transition-all duration-300";

const VARIANTS = {
  subtle: () => (
    <a
      {...linkProps}
      className={cn(FLOATING, "bottom-2 bg-white/60 backdrop-blur-sm px-2.5 py-0.5 font-semibold text-[#2B3674]/40 hover:text-[#4318FF] hover:bg-white/90")}
    >
      <Label />
    </a>
  ),
  pill: () => (
    <a
      {...linkProps}
      className={cn(
        FLOATING,
        "group bg-white px-3 py-1 font-semibold text-[#4318FF] border border-indigo-100 shadow-[0_4px_14px_rgba(67,24,255,0.10)] hover:shadow-[0_6px_20px_rgba(67,24,255,0.18)] hover:-translate-y-0.5",
      )}
    >
      <Code2 className="h-3 w-3 transition-transform duration-300 group-hover:scale-110" />
      <Label />
    </a>
  ),
  gradient: () => (
    <a
      {...linkProps}
      className={cn(
        FLOATING,
        "group bg-gradient-to-r from-[#4318FF] to-[#7C5FFF] px-3 py-1 font-semibold text-white/90 shadow-md shadow-indigo-500/25 opacity-80 hover:opacity-100 hover:text-white hover:shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-0.5",
      )}
    >
      <Sparkles className="h-3 w-3 transition-transform duration-300 group-hover:rotate-12" />
      <Label />
    </a>
  ),
};

const SIDEBAR_ROUTES = /^\/(admin|dashboard)(\/|$)/;

/** Floating watermark, rendered once in App. */
const Watermark = () => {
  const { pathname } = useLocation();
  if (WATERMARK_STYLE === "none") return null;
  if (WATERMARK_STYLE === "sidebar") {
    // The sidebars render their own credit; elsewhere fall back to the subtle text.
    return SIDEBAR_ROUTES.test(pathname) ? null : <VARIANTS.subtle />;
  }
  const Variant = VARIANTS[WATERMARK_STYLE];
  return <Variant />;
};

/** Credit line for the bottom of the admin/student sidebars (only in `sidebar` style). */
export const SidebarWatermark = () =>
  WATERMARK_STYLE === "sidebar" ? (
    <a
      {...linkProps}
      className="block text-center text-[11px] font-medium text-gray-400 hover:text-[#4318FF] transition-colors pt-1"
    >
      <Label />
    </a>
  ) : null;

export default Watermark;
