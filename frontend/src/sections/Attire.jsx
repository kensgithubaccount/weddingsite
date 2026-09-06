import { Reveal, SectionHeading } from "@/components/Reveal";
import { BowTie } from "@/components/LineArt";
import { useContent } from "@/lib/content";

const Attire = () => {
  const { attire } = useContent();

  return (
    <section id="attire" className="relative py-28 md:py-44" data-testid="attire-section">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeading index={4} label="Attire" title={attire.headline} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="font-body text-[#1A1A1A] text-base md:text-lg leading-[1.9] max-w-xl" data-testid="attire-body">
                {attire.body}
              </p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 mt-16">
              {attire.guidance.map((g, i) => (
                <Reveal key={g.label} delay={i * 0.06}>
                  <div className="rule-fine pt-5 pb-6" data-testid={`attire-guidance-${i}`}>
                    <p className="overline-label text-[#1D3F2C]">{g.label}</p>
                    <p className="font-body text-sm text-[#595959] leading-relaxed mt-3">{g.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.12} className="lg:col-span-4 lg:col-start-9 lg:mt-32">
            <figure className="text-center">
              <BowTie className="w-24 md:w-28 mx-auto" testId="attire-illustration" />
              <figcaption className="font-body italic text-[#595959] text-sm mt-6">
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
