import { Sparkles } from "lucide-react";

// Small author credit shown on every page.
const Watermark = () => (
  <a
    href="https://www.mochamadfarhanali.my.id/"
    target="_blank"
    rel="noopener noreferrer"
    className="group fixed bottom-3 left-1/2 -translate-x-1/2 z-40 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#4318FF] to-[#7C5FFF] px-3 py-1 text-[10px] font-semibold tracking-wide text-white/90 shadow-md shadow-indigo-500/25 opacity-80 transition-all duration-300 hover:opacity-100 hover:text-white hover:shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-0.5"
  >
    <Sparkles className="h-3 w-3 transition-transform duration-300 group-hover:rotate-12" />
    Developed by <span className="font-bold">mchdfrhn</span>
  </a>
);

export default Watermark;
