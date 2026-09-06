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
    <path d="M72 68v14" />
    <path d="M72 82 54 132h36L72 82Z" />
    <path d="M64 132l-5 34M80 132l5 34" />
    <path d="M72 84c8 6 16 10 24 12" />
    {/* Ken — curls, beard, straight body */}
    <circle cx="152" cy="48" r="15" />
    <path d="M138 40c-3-7 5-11 9-7M146 32c3-6 12-5 13 1M158 33c6-2 11 4 8 9" />
    <path d="M141 58c-2 8 4 14 11 14s13-6 11-14" strokeWidth="3.5" />
    <path d="M152 64v56" />
    <path d="M152 120l-8 44M152 120l8 44" />
    <path d="M152 80c-10 4-20 10-28 16" />
    <path d="M146 74l6 6 6-6" strokeWidth="2.5" />
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

/* Plain side-profile cab. */
export const TaxiLine = ({ className = "", testId = "line-taxi" }) => (
  <svg viewBox="0 0 200 110" fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...base(className, testId)}>
    <path d="M24 66h120c7 0 14 3 18 9l7 11c2 3 0 7-4 7H24c-4 0-7-3-6-7l4-14c1-4 2-6 2-6Z" />
    <path d="M46 66l10-18c2-4 6-6 11-6h36c6 0 12 3 15 9l9 15" />
    <path d="M78 30h22v12H78z" />
    <path d="M66 66V48M104 66V46" strokeWidth="2.5" />
    <path d="M52 78h96" strokeWidth="2" strokeDasharray="6 6" />
    <circle cx="58" cy="94" r="11" />
    <circle cx="146" cy="94" r="11" />
    <circle cx="58" cy="94" r="3.5" strokeWidth="2" />
    <circle cx="146" cy="94" r="3.5" strokeWidth="2" />
  </svg>
);

/* Bow tie. */
export const BowTie = ({ className = "", testId = "line-bowtie" }) => (
  <svg viewBox="0 0 120 80" fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...base(className, testId)}>
    <path d="M16 18 52 38 16 62c-3 2-6 0-6-4V22c0-4 3-6 6-4Z" />
    <path d="M104 18 68 38l36 24c3 2 6 0 6-4V22c0-4-3-6-6-4Z" />
    <rect x="52" y="30" width="16" height="18" rx="3" />
    <path d="M22 30c8 4 16 7 24 8M98 30c-8 4-16 7-24 8" strokeWidth="2" />
  </svg>
);

/* Champagne coupe. */
export const Coupe = ({ className = "", testId = "line-coupe" }) => (
  <svg viewBox="0 0 100 130" fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...base(className, testId)}>
    <path d="M18 26h64c0 20-12 32-32 32S18 46 18 26Z" />
    <path d="M26 34h48" strokeWidth="2" />
    <path d="M50 58v44" />
    <path d="M32 106c6-4 12-6 18-6s12 2 18 6" />
    <circle cx="40" cy="42" r="1.8" strokeWidth="1.5" />
    <circle cx="56" cy="46" r="1.8" strokeWidth="1.5" />
    <circle cx="48" cy="38" r="1.8" strokeWidth="1.5" />
  </svg>
);

/* Small envelope. */
export const Envelope = ({ className = "", testId = "line-envelope" }) => (
  <svg viewBox="0 0 120 90" fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...base(className, testId)}>
    <rect x="12" y="20" width="96" height="56" rx="2" />
    <path d="M14 24l46 34 46-34" />
    <path d="M14 74l32-26M106 74 74 48" strokeWidth="2" />
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
