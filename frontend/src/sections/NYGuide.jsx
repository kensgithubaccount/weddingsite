import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { useContent } from "@/lib/content";

const VENUE_PIN = { x: 50, y: 18 };
const ROUTE = [
  [62, 78], [52, 14], [45, 42], [46, 35], [45, 38], [52, 22], [47, 36], [50, 18],
];

const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const NYGuide = () => {
  const { ny_guide } = useContent();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePin, setActivePin] = useState(null);
  const [mapOk, setMapOk] = useState(true);

  const categories = useMemo(
    () => ["All", ...new Set(ny_guide.recommendations.map((r) => r.category))],
    [ny_guide]
  );
  const recs = useMemo(
    () => (activeCategory === "All" ? ny_guide.recommendations : ny_guide.recommendations.filter((r) => r.category === activeCategory)),
    [ny_guide, activeCategory]
  );

  const goToRec = (num) => {
    setActivePin(num);
    const el = document.getElementById(`rec-${num}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section id="new-york" className="relative py-24 md:py-36" data-testid="ny-guide-section">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeading index={7} label={ny_guide.label} title={ny_guide.headline}>
          <p className="font-display italic text-xl text-[#1A1A1A]">{ny_guide.subhead}</p>
          <p className="mt-3">{ny_guide.body}</p>
          <p className="font-label text-[0.62rem] tracking-[0.18em] uppercase text-[#1D3F2C] mt-5">{ny_guide.disclaimer}</p>
        </SectionHeading>

        {/* The interactive map */}
        {mapOk && (
          <div className="mb-20" data-testid="manhattan-map-feature">
            <Reveal>
              <div className="flex items-baseline justify-between rule-fine pt-4 mb-8">
                <span className="overline-label">{ny_guide.map_title}</span>
                <span className="overline-label hidden sm:block">Fig. 2</span>
              </div>
              <p className="font-body italic text-[#595959] text-sm mb-8 max-w-xl">{ny_guide.map_caption}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative border border-[#1A1A1A]/25 bg-[#F2EFE9] p-2.5 md:p-3 max-w-3xl mx-auto">
                <div className="relative">
                  <img
                    src="/illustrations/manhattan-map.png"
                    alt="Hand-drawn illustrated map of Manhattan with numbered oxblood pins marking each recommendation, and an increasingly irrational red route between them"
                    className="w-full h-auto block"
                    loading="lazy"
                    onError={() => setMapOk(false)}
                    data-testid="manhattan-map-image"
                  />
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    aria-hidden="true"
                  >
                    <polyline
                      points={ROUTE.map((p) => p.join(",")).join(" ")}
                      fill="none"
                      stroke="#1D3F2C"
                      strokeWidth="0.5"
                      strokeDasharray="1.4 1"
                      opacity="0.75"
                    />
                  </svg>
                  {ny_guide.recommendations.map((r) => (
                    <button
                      key={r.num}
                      onClick={() => goToRec(r.num)}
                      onMouseEnter={() => setActivePin(r.num)}
                      onFocus={() => setActivePin(r.num)}
                      aria-label={`${r.num} — ${r.name}. Show recommendation.`}
                      className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full border font-label text-[0.55rem] font-bold flex items-center justify-center transition-all ${
                        activePin === r.num
                          ? "bg-[#1D3F2C] text-[#F7F5F0] border-[#1D3F2C] scale-125"
                          : "bg-[#F7F5F0]/90 text-[#1D3F2C] border-[#1D3F2C] hover:bg-[#1D3F2C] hover:text-[#F7F5F0]"
                      }`}
                      style={{ left: `${r.pin.x}%`, top: `${r.pin.y}%` }}
                      data-testid={`map-pin-${r.num}`}
                    >
                      {r.num}
                    </button>
                  ))}
                  <span
                    className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-[#1A1A1A] text-[#F7F5F0] font-label text-[0.45rem] font-bold flex items-center justify-center"
                    style={{ left: `${VENUE_PIN.x}%`, top: `${VENUE_PIN.y}%` }}
                    title="The wedding — 5:30 PM"
                    aria-label="The New York Athletic Club — the wedding, 5:30 PM"
                    data-testid="map-pin-venue"
                  >
                    5:30
                  </span>
                </div>
                <p className="font-label text-[0.6rem] tracking-[0.16em] uppercase text-[#595959] pt-2.5 px-1 flex justify-between">
                  <span>{activePin ? ny_guide.recommendations.find((r) => r.num === activePin)?.name : "Hover the pins. Judge the route."}</span>
                  <span className="hidden sm:inline">Not to scale. Obviously.</span>
                </p>
              </div>
            </Reveal>
          </div>
        )}

        {/* Recommendations */}
        <div className="flex flex-wrap items-center gap-2 mb-6" role="tablist" aria-label="Recommendation categories">
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-label text-[0.68rem] tracking-[0.16em] uppercase px-5 py-2.5 border transition-colors ${
                activeCategory === cat
                  ? "bg-[#1A1A1A] text-[#F7F5F0] border-[#1A1A1A]"
                  : "border-[#1A1A1A]/40 text-[#1A1A1A] hover:border-[#1A1A1A]"
              }`}
              data-testid={`ny-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 -mx-5 px-5 lg:mx-0 lg:px-0 lg:block lg:overflow-visible lg:snap-none" data-testid="ny-recommendations">
          {recs.map((r) => (
            <article
              key={r.num}
              id={`rec-${r.num}`}
              onMouseEnter={() => setActivePin(r.num)}
              className={`min-w-[82vw] sm:min-w-[60vw] lg:min-w-0 snap-center shrink-0 lg:shrink rule-fine lg:first:border-t-0 border lg:border-0 border-[#1A1A1A]/15 p-6 lg:p-0 lg:py-9 grid lg:grid-cols-[4rem_1fr_auto] gap-4 lg:gap-8 items-start transition-colors ${
                activePin === r.num ? "lg:bg-[#F2EFE9]" : ""
              }`}
              data-testid={`ny-rec-${r.num}`}
            >
              <span className={`font-label text-[0.7rem] tracking-[0.1em] pt-1.5 ${activePin === r.num ? "text-[#1D3F2C] font-bold" : "text-[#595959]/60"}`}>
                {r.num}
              </span>
              <div>
                <p className="overline-label">{r.category}</p>
                <h3 className="font-display text-2xl sm:text-3xl tracking-tight text-[#1A1A1A] mt-2">{r.name}</h3>
                <p className="font-body text-[#595959] text-[0.95rem] leading-relaxed mt-3 max-w-2xl">{r.body}</p>
                {r.note && <p className="font-body italic text-[#1D3F2C] text-sm mt-2">Editorial note: {r.note}</p>}
                <p className="font-label text-[0.6rem] tracking-[0.2em] uppercase text-[#1D3F2C] mt-4">{r.tag}</p>
              </div>
              <a
                href={mapsUrl(r.maps_query)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-label text-[0.62rem] tracking-[0.16em] uppercase border border-[#1A1A1A]/40 px-4 py-2.5 hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors self-start"
                data-testid={`ny-maps-${r.num}`}
              >
                <MapPin size={12} /> Open in maps
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NYGuide;
