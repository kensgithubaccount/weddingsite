import { SITE_PHASE, phasePreviewEnabled } from "@/lib/sitePhase";

const options = [
  { value: "save-the-date", label: "Save the Date" },
  { value: "full-wedding", label: "Full Site" },
];

export const PhasePreviewToggle = () => {
  if (!phasePreviewEnabled) return null;

  const choosePhase = (phase) => {
    if (phase === SITE_PHASE) return;
    window.location.assign(`/?phase=${phase}`);
  };

  return (
    <aside
      className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-[120] bg-[#F7F5F0]/95 backdrop-blur border border-[#1A1A1A]/20 shadow-[0_8px_28px_rgba(26,26,26,0.14)] p-1.5"
      aria-label="Preview version"
      data-testid="phase-preview-toggle"
    >
      <div className="px-2 pt-1 pb-1.5 font-label text-[0.5rem] tracking-[0.2em] uppercase text-[#595959]">
        Preview
      </div>
      <div className="flex gap-1">
        {options.map((option) => {
          const active = SITE_PHASE === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => choosePhase(option.value)}
              aria-pressed={active}
              className={`font-label text-[0.58rem] sm:text-[0.62rem] tracking-[0.12em] uppercase px-3 py-2 transition-colors ${
                active
                  ? "bg-[#1D3F2C] text-[#F7F5F0]"
                  : "text-[#1A1A1A] hover:bg-[#1A1A1A]/10"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
