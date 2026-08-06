const ITEMS = [
  "Sophie + Ken",
  "June 5, 2027",
  "New York Athletic Club",
  "One Night Only",
  "180 Central Park South",
  "Saturday Edition",
];

export const Marquee = () => (
  <div
    className="overflow-hidden border-y border-[#1A1A1A]/15 bg-[#F2EFE9] py-3.5"
    aria-hidden="true"
    data-testid="editorial-marquee"
  >
    <div className="marquee-track flex whitespace-nowrap w-max">
      {[0, 1].map((copy) => (
        <div key={copy} className="flex">
          {ITEMS.concat(ITEMS).map((item, i) => (
            <span
              key={`${copy}-${i}`}
              className="font-label text-[0.65rem] tracking-[0.3em] uppercase text-[#595959] px-6 flex items-center gap-6"
            >
              {item}
              <span className="text-[#731F17]">·</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);
