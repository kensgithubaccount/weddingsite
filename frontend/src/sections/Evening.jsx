import { Reveal, SectionHeading } from "@/components/Reveal";
import { useContent } from "@/lib/content";

const Evening = () => {
  const content = useContent();
  const program = content.schedule;
  const venue = content.venue;

  return (
    <section id="evening" data-testid="evening-section">
      <div className="py-16 md:py-24 max-w-7xl mx-auto px-5 md:px-10 overflow-visible">
        <div className="max-w-5xl mx-auto">
          <SectionHeading title="The Details" />

          <div className="border-y border-[#1A1A1A]/20">
            {program.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <div
                  className="grid grid-cols-[88px_1px_1fr] sm:grid-cols-[140px_1px_1fr] gap-5 sm:gap-8 py-7 md:py-8 border-t border-[#1A1A1A]/12 first:border-t-0"
                  data-testid={`schedule-item-${i}`}
                >
                  <div className="font-label text-[0.68rem] tracking-[0.12em] uppercase text-[#1D3F2C] pt-1.5 leading-relaxed whitespace-nowrap">
                    {item.time}
                  </div>

                  <div className="w-px bg-[#1A1A1A]/25 self-stretch" aria-hidden="true" />

                  <div className="pb-1">
                    <h3 className="font-display text-2xl sm:text-[1.7rem] tracking-tight text-[#1A1A1A] leading-none">
                      {item.title.replace(/^The\s+/i, "")}
                    </h3>
                    <p className="font-body text-[#595959] mt-2 text-[0.95rem] leading-relaxed">
                      {item.description}
                    </p>
                    {i === 0 && (
                      <p className="font-label text-[0.58rem] sm:text-[0.62rem] tracking-[0.14em] uppercase text-[#595959] mt-3 leading-relaxed">
                        {venue.name}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.12}>
            <div className="mt-8 md:mt-12 relative left-1/2 w-screen -translate-x-1/2 px-4 md:px-8">
              <img
                src="/art/taxi-responsive.png"
                alt="New York City taxi with trailing cans"
            <div className="mt-7 md:mt-9 w-full">
              <img
                src="/art/vintage_nyc_taxi_with_trailing_cans.png"
                alt=""
                aria-hidden="true"
                className="block w-full h-auto object-contain"
                data-testid="details-save-date-cab"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Evening;
