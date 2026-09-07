import { Reveal, SectionHeading } from "@/components/Reveal";
import { useContent } from "@/lib/content";

const Attire = () => {
  const { attire } = useContent();

  return (
    <section id="attire" className="relative pt-14 md:pt-20 pb-16 md:pb-24" data-testid="attire-section">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeading index={4} label="Attire" title={attire.headline} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-12">
            <Reveal>
              <p className="font-body text-[#1A1A1A] text-base md:text-lg leading-[1.9] max-w-3xl" data-testid="attire-body">
                {attire.body}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Attire;
