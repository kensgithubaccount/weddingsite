export const Seal = ({ size = 96, className = "", color = "#1D3F2C" }) => {
  /* The light variant (dark footer) recolors the transparent PNG to ivory. */
  const light = color.toLowerCase() === "#f7f5f0";
  return (
    <img
      src="/seal.png"
      width={size}
      height={size}
      className={className}
      style={light ? { filter: "brightness(0) invert(1)", opacity: 0.92 } : undefined}
      role="img"
      aria-label="SK+KS seal, property of NYC"
      data-testid="couple-seal"
    />
  );
};

export const DateStamp = ({ text = "JUN 05 2027", className = "" }) => (
  <div
    className={`inline-block border-2 border-[#1D3F2C] text-[#1D3F2C] font-label font-semibold text-[0.65rem] tracking-[0.28em] uppercase px-4 py-2.5 ${className}`}
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
