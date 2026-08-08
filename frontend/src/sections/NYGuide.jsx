import { useState } from "react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import SpotArt from "@/components/SpotArt";
import { useContent } from "@/lib/content";

const NYGuide = () => {
  const { ny_guide } = useContent();
  const [active, setActive] = useState("Eat");
  const recs = ny_guide.recommendations.filter((r) => r.category === active);

  return (
    <section id="new-york" className="relative py-24 md:py-36" data-testid="ny-guide-section">
      <SpotArt
        src="/illustrations/spot-review.png"
        alt="Ink drawing of a hand editing a recommendation list reading Pasta, Pizza, Steak, Everything"
        className="hidden xl:block absolute right-12 top-44 w-28 opacity-90"
        rotate={3}
      />
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeading index={4} label="New York" title="New York, According to Us">
          <p>{ny_guide.intro}</p>
        </SectionHeading>

        <Reveal>
          <figure className="border border-[#1A1A1A]/25 bg-[#F2EFE9] p-2.5 md:p-3 mb-16" data-testid="manhattan-plan-figure">
            <img
              src="/illustrations/manhattan-plan.png"
              alt="Editorial cartoon of an out-of-town wedding guest at a Manhattan hotel desk calmly constructing an impossible Saturday itinerary: a map of Manhattan crossed by frantic red arrows, a coffee cup, a wristwatch, the wedding invitation and a neatly handwritten schedule"
              className="w-full h-72 sm:h-96 lg:h-[30rem] object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.closest("figure").style.display = "none";
              }}
              data-testid="manhattan-plan-illustration"
            />
            <figcaption className="pt-3 px-1 pb-1 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <span className="font-body italic text-[#595959] text-sm">A perfectly reasonable Saturday, on paper.</span>
              <span className="font-label text-[0.6rem] tracking-[0.16em] uppercase text-[#595959]">The Manhattan Plan</span>
            </figcaption>
          </figure>
        </Reveal>

        <Reveal>
          <div className="flex flex-wrap gap-2 mb-14" role="tablist" aria-label="Recommendation categories">
            {ny_guide.categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={active === cat}
                onClick={() => setActive(cat)}
                className={`font-label text-[0.68rem] tracking-[0.16em] uppercase px-5 py-2.5 border transition-colors ${
                  active === cat
                    ? "bg-[#1A1A1A] text-[#F7F5F0] border-[#1A1A1A]"
                    : "border-[#1A1A1A]/40 text-[#1A1A1A] hover:border-[#1A1A1A]"
                }`}
                data-testid={`ny-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        {recs.length === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <Reveal className="lg:col-span-6">
              <p className="font-display text-2xl sm:text-3xl tracking-tight text-[#1A1A1A] leading-snug max-w-lg" data-testid="ny-empty-note">
                {ny_guide.empty_note}
              </p>
              <p className="font-body italic text-[#595959] mt-6 text-sm">
                Recommendations will be passed quietly, the way they should be.
              </p>
            </Reveal>
            <Reveal delay={0.12} className="lg:col-span-5 lg:col-start-8">
              <figure className="border border-[#1A1A1A]/25 bg-[#F2EFE9] p-2.5">
                <img
                  src="/illustrations/doorman.png"
                  alt="Ink-and-wash illustration of a Manhattan doorman reviewing a very long guest list"
                  className="w-full h-72 object-cover"
                  loading="lazy"
                  data-testid="ny-illustration"
                />
                <figcaption className="font-label text-[0.6rem] tracking-[0.16em] uppercase text-[#595959] pt-2.5 px-1">
                  The doorman knows a place
                </figcaption>
              </figure>
            </Reveal>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recs.map((rec) => (
              <article key={rec.name} className="rule-fine pt-5" data-testid={`ny-rec-${rec.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <p className="overline-label">{rec.neighborhood}</p>
                <h3 className="font-display text-2xl mt-2">{rec.name}</h3>
                <p className="font-body text-sm text-[#595959] mt-3 leading-relaxed">{rec.note}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NYGuide;
