import { Upload, ShieldCheck } from "lucide-react";
import { CATEGORY_LABELS, groupByCategory } from "@/utils/eventConstants";

const RequirementList = ({ templates }) => {
  if (!templates.length) {
    return <p className="text-gray-400 text-sm italic">Persyaratan belum diatur oleh admin.</p>;
  }
  let counter = 0;
  return (
    <div className="space-y-6">
      {groupByCategory(templates).map(({ category, items }) => (
        <div key={category} className="space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{CATEGORY_LABELS[category]}</p>
          <ul className="grid gap-3">
            {items.map((t) => {
              counter += 1;
              return (
                <li key={t.id} className="flex gap-4 items-start">
                  <div className="mt-0.5 shrink-0 h-6 w-6 rounded-full bg-indigo-50 flex items-center justify-center">
                    <span className="text-xs font-bold text-[#4318FF]">{counter}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[#2B3674] leading-relaxed">{t.title}</p>
                      {!t.is_required && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Opsional</span>
                      )}
                    </div>
                    {t.description && <p className="text-xs text-gray-500 mt-0.5">{t.description}</p>}
                    <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-gray-400">
                      {t.needs_upload ? (
                        <>
                          <Upload className="h-3 w-3" /> Unggah berkas (PDF/gambar, maks 10 MB)
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-3 w-3" /> Diverifikasi langsung oleh admin
                        </>
                      )}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default RequirementList;
