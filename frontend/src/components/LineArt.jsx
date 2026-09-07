const INK = "#1A1A1A";
const GREEN = "#1D3F2C";

const base = (className, testId) => ({
  className: `select-none ${className}`,
  "data-testid": testId,
  "aria-hidden": true,
  focusable: false,
});

/* Still unmistakably stick figures, just with a little more personality. */
export const StickCouple = ({ className = "", testId = "line-stick-couple" }) => (
  <svg viewBox="0 0 240 190" fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" {...base(className, testId)}>
    {/* Sophie: huge hair, leaning in, one heel already abandoned. */}
    <circle cx="82" cy="50" r="15" />
    <path d="M66 45c-8-8 0-18 8-14M70 34c4-9 17-9 21 0M88 34c9-3 16 6 12 13M99 44c7 5 4 16-2 20M67 42c-9 9-9 23-5 31" />
    <path d="M76 48h3M85 48h3" />
    <path d="M78 56q5 4 10 0" />
    <path d="M82 65l5 19" />
    <path d="M87 84l-15 48h34L87 84Z" />
    <path d="M79 132l-5 31M98 132l7 30" />
    <path d="M69 165h10M101 164h9" />
    <path d="M86 86c12 8 24 13 36 15" />
    <path d="M72 135c-7 8-13 16-17 25" />
    <path d="M47 164h13l-4 4h-9" strokeWidth="2" />

    {/* Ken: curls, oversized beard, tie, and a slightly too-long arm around Sophie. */}
    <circle cx="159" cy="48" r="15" />
    <path d="M145 40c-2-8 7-12 12-7M154 32c4-7 14-4 14 2M166 34c7-2 12 6 8 12" />
    <path d="M153 46h3M162 46h3" />
    <path d="M154 53q5 4 10 0" />
    <path d="M148 57c0 12 5 18 12 18 9 0 15-7 14-18M150 61c7 3 15 3 22 0" strokeWidth="3.4" />
    <path d="M159 72v51" />
    <path d="M153 77l6 7 6-7M159 84v20" strokeWidth="2.2" />
    <path d="M159 123l-9 40M159 123l10 40" />
    <path d="M145 165h10M165 165h10" />
    <path d="M155 83c-15 5-31 2-50-8" />
    <path d="M162 84c13 3 22 10 27 21" />

    {/* Hand-holding, rendered with the confidence of a five-year-old. */}
    <circle cx="123" cy="101" r="3.5" />
    <path d="M119 98l4 3 4-3" strokeWidth="2" />
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
