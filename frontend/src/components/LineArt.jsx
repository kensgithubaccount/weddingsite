const INK = "#1A1A1A";
const GREEN = "#1D3F2C";

const base = (className, testId) => ({
  className: `select-none ${className}`,
  "data-testid": testId,
  "aria-hidden": true,
  focusable: false,
});

/* Deliberately crude stick figures of Sophie and Ken — fifteen seconds, somehow perfect. */
export const StickCouple = ({ className = "", testId = "line-stick-couple" }) => (
  <svg viewBox="0 0 220 190" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...base(className, testId)}>
    {/* Sophie — wavy hair, little veil, triangle dress */}
    <circle cx="72" cy="52" r="15" />
    <path d="M57 46c-4-6 2-12 7-10M60 38c2-7 12-8 15-3M78 36c6-3 12 3 10 9M87 44c5 2 5 10 1 13" />
    <path d="M60 40C50 46 46 58 48 70" />
    <path d="M66 50h4M74 50h4" />
    <path d="M67 58q5 5 10 0" />
    <path d="M72 68v14" />
    <path d="M72 82 54 132h36L72 82Z" />
    <path d="M64 132l-5 34M80 132l5 34" />
    <path d="M54 168h9M81 168h9" />
    <path d="M72 84l-16-10" />
    {/* Ken — curls, beard, straight body */}
    <circle cx="152" cy="48" r="15" />
    <path d="M138 40c-3-7 5-11 9-7M146 32c3-6 12-5 13 1M158 33c6-2 11 4 8 9" />
    <path d="M146 46h4M154 46h4" />
    <path d="M147 53q5 4 10 0" />
    <path d="M141 58c-2 8 4 14 11 14s13-6 11-14" strokeWidth="3.5" />
    <path d="M152 64v56" />
    <path d="M152 120l-8 44M152 120l8 44" />
    <path d="M139 166h9M156 166h9" />
    <path d="M146 74l6 6 6-6" strokeWidth="2.5" />
    <path d="M152 80l16-12" />
    {/* holding hands */}
    <path d="M72 84c10 6 22 10 34 13" />
    <path d="M152 80c-10 4-24 10-38 17" />
    <circle cx="110" cy="98" r="3" />
  </svg>
);

/* Tiny cab pulling celebratory cans — the Save the Date motif. */
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

/* One pigeon, mildly lost. */
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
