import { Reveal, SectionHeading } from "@/components/Reveal";
import SpotArt from "@/components/SpotArt";
import { useContent } from "@/lib/content";

const Travel = () => {
  const { travel } = useContent();

  return (
    <section id="travel" className="relative py-24 md:py-36 bg-[#F2EFE9]" data-testid="travel-section">
      <SpotArt
        src="/illustrations/spot-twohundred.png"
        alt="Ink drawing of a taxi roof sign reading Two Hundred"
        className="hidden xl:block absolute left-12 top-44 w-28 opacity-90"
        rotate={-3}
      />
      <SpotArt
        src="/illustrations/spot-coffee.png"
        alt="Ink drawing of a strong cup of coffee beside folded eyeglasses and a drooping newspaper"
        className="hidden xl:block absolute right-12 bottom-24 w-28 opacity-90"
        rotate={3}
      />
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeading index={5} label="Travel & Stay" title="Getting Here. Staying Here.">
          <p>{travel.intro}</p>
        </SectionHeading>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="overline-label mb-6">Getting to New York</p>
            </Reveal>
            <div className="space-y-0">
              {travel.getting_here.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.06}>
                  <div className="rule-fine py-6 grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-2 sm:gap-6" data-testid={`travel-item-${i}`}>
                    <h3 className="font-display text-xl tracking-tight text-[#1A1A1A]">{item.title}</h3>
                    <p className="font-body text-sm text-[#595959] leading-relaxed">{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.1}>
              <div className="border border-[#1A1A1A]/25 bg-[#F7F5F0] p-8" data-testid="hotels-note-card">
                <p className="overline-label text-[#731F17]">Where to stay</p>
                <p className="font-display text-2xl tracking-tight mt-4 text-[#1A1A1A] leading-snug">
                  {travel.hotels_note}
                </p>
                <p className="font-body italic text-[#595959] text-sm mt-5">
                  Booking deadlines will be marked clearly — no alarms, we promise.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Travel;
