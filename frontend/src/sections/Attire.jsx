import { Reveal, SectionHeading } from "@/components/Reveal";
import { useContent } from "@/lib/content";

const Attire = () => {
  const { attire } = useContent();

  return (
    <section id="attire" className="py-24 md:py-36" data-testid="attire-section">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeading index={6} label="Attire" title={attire.headline} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <Reveal className="lg:col-span-6">
            <p className="font-body text-[#1A1A1A] text-base md:text-lg leading-[1.9] max-w-xl" data-testid="attire-body">
              {attire.body}
            </p>
            <p className="font-body italic text-[#595959] text-sm mt-6">
              When it is announced, it will be specific. Nobody should have to telephone the couple about shoes.
            </p>
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-5 lg:col-start-8">
            <figure className="border border-[#1A1A1A]/25 bg-[#F2EFE9] p-2.5">
              <img
                src="/illustrations/chairs.png"
                alt="Ink-and-wash illustration of two chairs reserved beside one another at a candlelit table"
                className="w-full h-72 object-cover"
                loading="lazy"
                data-testid="attire-illustration"
              />
              <figcaption className="font-label text-[0.6rem] tracking-[0.16em] uppercase text-[#595959] pt-2.5 px-1">
                Two seats, reserved
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Attire;
