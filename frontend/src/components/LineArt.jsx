const INK = "#1A1A1A";
const GREEN = "#1D3F2C";

const base = (className, testId) => ({
  className: `select-none ${className}`,
  "data-testid": testId,
  "aria-hidden": true,
  focusable: false,
});

/* Sophie + Ken, drawn from memory by someone with maybe six crayons. */
export const StickCouple = ({ className = "", testId = "line-stick-couple" }) => (
  <svg viewBox="0 0 240 190" fill="none" stroke={INK} strokeWidth="3.1" strokeLinecap="round" strokeLinejoin="round" {...base(className, testId)}>
    {/* Sophie */}
    <path d="M64 46c1-13 11-22 24-21 12 1 20 10 20 22 0 13-9 22-22 22-13 0-23-9-22-23Z" />
    <circle cx="80" cy="47" r="1.4" fill={INK} stroke="none" />
    <circle cx="93" cy="47" r="1.4" fill={INK} stroke="none" />
    <path d="M80 57c5 4 10 4 14 0" />
    <path d="M68 33c-6 11-6 28-5 42M72 29c-2 13-1 31 0 48M78 27c2 14 2 33 2 50M101 34c4 11 5 27 4 41M96 29c1 14 2 31 1 47" />
    <path d="M86 69v16" />
    <path d="M86 84 68 129h37L86 84Z" />
    <path d="M76 98 61 113M96 98l15 13" />
    <path d="M77 129v31M96 129v31" />
    <path d="M72 161h10M92 161h10" />

    {/* Ken */}
    <path d="M132 43c0-13 10-23 23-23s24 10 24 23c0 13-10 22-23 22-14 0-24-9-24-22Z" />
    <circle cx="149" cy="44" r="1.4" fill={INK} stroke="none" />
    <circle cx="163" cy="44" r="1.4" fill={INK} stroke="none" />
    <path d="M148 53c5 4 11 4 16 0" />
    <path d="M135 31c-4-5 3-9 7-5 0-7 9-8 11-2 3-7 12-5 12 1 5-5 12 1 8 6M134 56c3 9 10 14 22 14s19-5 22-14M139 58c4 7 11 10 17 10 7 0 13-3 18-10" strokeWidth="3.5" />
    <path d="M156 70v53" />
    <path d="M156 87 137 108M156 88l20 20" />
    <path d="M156 123 146 161M156 123l12 38" />
    <path d="M141 162h10M164 162h10" />
  </svg>
);

/* A tiny, slightly wonky NYC cab in the same hand-drawn spirit as the Save the Date. */
export const SaveDateCab = ({ className = "", testId = "line-save-date-cab" }) => (
  <svg viewBox="0 0 300 128" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...base(className, testId)}>
    <path d="M47 77c2-9 8-15 18-17l38-6 20-27c4-5 9-8 16-8h48c8 0 14 3 19 9l20 27 22 4c10 2 16 8 18 18l2 11c1 5-2 8-7 8H54c-6 0-9-4-8-9l1-10Z" />
    <path d="M111 54h105" />
    <path d="M129 27l-16 27M168 20v34M201 29l15 25" strokeWidth="2" />
    <path d="M151 18h38l4-11h-46l4 11Z" />
    <path d="M160 10h22" strokeWidth="1.7" />
    <circle cx="91" cy="94" r="17" />
    <circle cx="224" cy="94" r="17" />
    <circle cx="91" cy="94" r="5" />
    <circle cx="224" cy="94" r="5" />
    <path d="M48 78h24M244 78h20M132 70h10M196 70h10" strokeWidth="2" />
    <path d="M74 62c9 2 15 7 20 15M226 61c-8 3-14 8-18 16" strokeWidth="1.8" />
    <path d="M18 89h18M10 99h25M23 109h14" strokeWidth="1.8" />
    <path d="M133 81c8 3 17 4 26 4 8 0 17-1 25-4" strokeWidth="1.7" />
  </svg>
);

export const CabCans = ({ className = "", testId = "line-cab-cans" }) => (
  <svg viewBox="0 0 240 120" fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...base(className, testId)}>
    <path d="M150 62h54c6 0 12 3 15 8l6 10c2 3 0 6-4 6h-71" />
    <path d="M154 62l8-16c2-4 6-6 10-6h22c5 0 10 3 12 8l6 14" />
    <path d="M176 40h18v10h-18z" />
    <path d="M170 62v-12M192 62v-10" strokeWidth="2.5" />
    <circle cx="172" cy="88" r="10" />
    <circle cx="208" cy="88" r="10" />
    <circle cx="172" cy="88" r="3" strokeWidth="2" />
    <circle cx="208" cy="88" r="3" strokeWidth="2" />
    <path d="M150 74c-14 4-24 10-32 16M150 78c-10 8-18 14-24 22" strokeWidth="2" />
    <path d="M112 92h14l-2 12h-10zM120 100h14l-2 12h-10z" strokeWidth="2.5" />
    <path d="M96 104h12l-2 10h-8z" strokeWidth="2.5" />
  </svg>
);

export const Pigeon = ({ className = "", testId = "line-pigeon" }) => (
  <svg viewBox="0 0 130 130" fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...base(className, testId)}>
    <path d="M30 88c-4-20 8-38 28-42 10-2 20 0 27 6" />
    <circle cx="92" cy="44" r="12" />
    <path d="M103 44l12 3-12 5" />
    <circle cx="94" cy="41" r="1.6" fill={GREEN} strokeWidth="1" />
    <path d="M32 88c10 8 26 10 40 6 10-3 18-9 22-18" />
    <path d="M30 88l-14 8M32 84l-12-2" strokeWidth="2.5" />
    <path d="M48 74c8-4 18-4 26 0" strokeWidth="2" />
    <path d="M56 96v14M70 95v15M52 112l8-2M66 112l8-2" strokeWidth="2.5" />
  </svg>
);
