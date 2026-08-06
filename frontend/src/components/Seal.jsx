export const Seal = ({ size = 96, className = "", color = "#731F17" }) => {
  const id = `seal-${size}-${color.replace("#", "")}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="SK+KS seal, property of NYC"
      data-testid="couple-seal"
    >
      <circle cx="60" cy="60" r="57" fill="none" stroke={color} strokeWidth="2.5" />
      <circle cx="60" cy="60" r="44" fill="none" stroke={color} strokeWidth="1" />
      <defs>
        <path id={`${id}-top`} d="M 60,60 m -50,0 a 50,50 0 1,1 100,0" />
        <path id={`${id}-bottom`} d="M 60,60 m -50,0 a 50,50 0 1,0 100,0" />
      </defs>
      <text fontFamily="Chivo, sans-serif" fontSize="10.5" letterSpacing="3.5" fill={color}>
        <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
          PROPERTY OF
        </textPath>
      </text>
      <text fontFamily="Chivo, sans-serif" fontSize="10.5" letterSpacing="3.5" fill={color}>
        <textPath href={`#${id}-bottom`} startOffset="50%" textAnchor="middle">
          NYC
        </textPath>
      </text>
      <text
        x="60"
        y="68"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontWeight="600"
        fontSize="24"
        fill={color}
      >
        SK+KS
      </text>
    </svg>
  );
};

export const DateStamp = ({ text = "JUN 05 2027", className = "" }) => (
  <div
    className={`inline-block border-2 border-[#731F17] text-[#731F17] font-label font-semibold text-[0.65rem] tracking-[0.28em] uppercase px-4 py-2.5 ${className}`}
    style={{ transform: "rotate(-10deg)" }}
    data-testid="date-stamp"
  >
    {text}
  </div>
);

export const EditionStamp = ({ text = "ONE NIGHT ONLY", className = "" }) => (
  <div
    className={`inline-block border border-[#1A1A1A]/60 text-[#1A1A1A]/80 font-label text-[0.6rem] tracking-[0.3em] uppercase px-3.5 py-2 rounded-full ${className}`}
    style={{ transform: "rotate(6deg)" }}
    data-testid="edition-stamp"
  >
    {text}
  </div>
);
