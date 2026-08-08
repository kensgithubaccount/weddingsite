const SpotArt = ({ src, alt, className = "", rotate = -2 }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    onError={(e) => {
      e.currentTarget.style.display = "none";
    }}
    style={{ transform: `rotate(${rotate}deg)` }}
    className={`select-none mix-blend-multiply ${className}`}
    data-testid={`spot-${src.split("/").pop().replace(".png", "")}`}
  />
);

export default SpotArt;
