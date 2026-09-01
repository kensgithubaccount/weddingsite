import { Reveal, SectionHeading } from "@/components/Reveal";
import SpotArt from "@/components/SpotArt";
import { useContent } from "@/lib/content";

const Story = () => {
  const { story } = useContent();

  return (
    <section id="story" className="relative py-24 md:py-36 bg-[#F2EFE9]" data-testid="story-section">
      <SpotArt
        src="/illustrations/spot-reservation.png"
        alt="Ink drawing of a hand changing a restaurant reservation from two people to two hundred"
        className="hidden xl:block absolute right-12 top-44 w-28 opacity-90"
        rotate={3}
      />
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeading index={3} label={story.label} title={story.headline}>
          <p className="font-label text-[0.65rem] tracking-[0.2em] uppercase text-[#731F17]">{story.kicker}</p>
          <p className="mt-3">{story.standfirst}</p>
        </SectionHeading>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="drop-cap font-body text-[#1A1A1A] text-base md:text-lg leading-[1.9]" data-testid="story-intro">
                {story.intro}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="font-body italic text-[#595959] mt-12 text-[0.95rem] rule-fine pt-6 max-w-md" data-testid="story-closing">
                {story.closing}
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            {story.photos.map((photo, i) => (
              <Reveal key={photo.url} delay={i * 0.1}>
                <figure data-testid={`story-photo-${i}`}>
                  <div className="border border-[#1A1A1A]/25 bg-[#F7F5F0] p-2.5">
                    <img
                      src={photo.url}
                      alt={photo.alt}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </div>
                  {photo.caption && (
                    <figcaption className="font-body italic text-[#595959] text-sm mt-3 max-w-sm">
                      {photo.caption}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
