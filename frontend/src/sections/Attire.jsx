import { Reveal, SectionHeading } from "@/components/Reveal";
import SpotArt from "@/components/SpotArt";
import { useContent } from "@/lib/content";

const Attire = () => {
  const { attire } = useContent();

  return (
    <section id="attire" className="relative py-24 md:py-36" data-testid="attire-section">
      <SpotArt
        src="/illustrations/spot-footwear.png"
        alt="Ink drawing of a formal shoe and a practical walking shoe beside a Manhattan curb"
        className="hidden xl:block absolute left-12 bottom-28 w-28 opacity-90"
        rotate={-3}
      />
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeading index={6} label="Attire" title={attire.headline} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="font-body text-[#1A1A1A] text-base md:text-lg leading-[1.9] max-w-xl" data-testid="attire-body">
                {attire.body}
              </p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 mt-12">
              {attire.guidance.map((g, i) => (
                <Reveal key={g.label} delay={i * 0.06}>
                  <div className="rule-fine pt-5 pb-6" data-testid={`attire-guidance-${i}`}>
                    <p className="overline-label text-[#731F17]">{g.label}</p>
                    <p className="font-body text-sm text-[#595959] leading-relaxed mt-3">{g.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.12} className="lg:col-span-4 lg:col-start-9">
            <figure className="border border-[#1A1A1A]/25 bg-[#F2EFE9] p-2.5">
              <img
                src="/illustrations/black-tie-transit.png"
                alt="Watercolor illustration of a yellow taxi carrying a dark suit, a bow tie, and dress shoes through Manhattan at night"
                className="w-full h-72 object-cover"
                loading="lazy"
                data-testid="attire-illustration"
              />
              <figcaption className="font-label text-[0.6rem] tracking-[0.16em] uppercase text-[#595959] pt-2.5 px-1">
                Black tie, in transit.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Attire;
