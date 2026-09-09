import { Reveal, SectionHeading } from "@/components/Reveal";
import { useContent } from "@/lib/content";

const Story = () => {
  const { story } = useContent();
  const naturalBreak = story.intro.indexOf(" Now they're getting married.");
  const introParagraphs = naturalBreak > -1
    ? [story.intro.slice(0, naturalBreak), story.intro.slice(naturalBreak + 1)]
    : [story.intro];

  return (
    <section id="story" className="relative py-16 md:py-24 bg-[#F2EFE9]" data-testid="story-section">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeading index={3} label={story.label} title={story.headline}>
          <p className="font-label text-[0.65rem] tracking-[0.2em] uppercase text-[#1D3F2C]">{story.kicker}</p>
          <p className="mt-3">{story.standfirst}</p>
        </SectionHeading>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="max-w-2xl lg:pr-8" data-testid="story-intro">
                {introParagraphs.map((paragraph, i) => (
                  <p
                    key={paragraph}
                    className={`${i === 0 ? "drop-cap" : "mt-6 md:mt-7"} font-body text-[#1A1A1A] text-base md:text-lg leading-[1.9]`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5 self-start">
            <Reveal delay={0.1}>
              <figure className="border border-[#1A1A1A]/25 bg-[#F7F5F0] p-2.5" data-testid="story-photo-0">
                <div className="py-10 md:py-14 flex justify-center">
                  <img
                    src="/art/stick-couple-exact.jpg"
                    alt="A simple drawing of Sophie and Ken"
                    className="w-44 md:w-56 h-auto object-contain"
                    data-testid="story-illustration"
                  />
                </div>
                <figcaption className="font-body italic text-[#595959] text-sm pt-2.5 px-1 pb-1 text-center">
                  Sophie and Ken, drawn from memory.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
