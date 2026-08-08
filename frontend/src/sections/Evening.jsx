import { Reveal, SectionHeading } from "@/components/Reveal";
import SpotArt from "@/components/SpotArt";
import { useContent } from "@/lib/content";

const ROW_SPOTS = [
  { src: "/illustrations/spot-coatcheck.png", alt: "Ink drawing of a coat-check ticket marked SK+KS" },
  { src: "/illustrations/spot-chairs.png", alt: "Ink drawing of two formal chairs with place cards reading Sophie and Ken" },
  { src: "/illustrations/spot-tray.png", alt: "Ink drawing of a waiter carrying a perfectly balanced tray" },
  { src: "/illustrations/spot-placecards.png", alt: "Ink drawing of two folded place cards marked S and K" },
];

const Evening = () => {
  const content = useContent();
  const program = content.schedule;
  const main = program.slice(0, 4);
  const afterParty = program[4];

  return (
    <section id="evening" data-testid="evening-section">
      <div className="py-24 md:py-36 max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeading index={2} label="The Evening" title="The Program">
          <p>One evening, four acts. All of it at 180 Central Park South.</p>
        </SectionHeading>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            {main.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <div
                  className="grid grid-cols-[92px_1fr] sm:grid-cols-[140px_1fr] gap-4 sm:gap-8 py-8 rule-fine first:border-t-0 first:pt-0"
                  data-testid={`schedule-item-${i}`}
                >
                  <div className="font-label text-[0.68rem] tracking-[0.14em] uppercase text-[#731F17] pt-1.5 leading-relaxed">
                    {item.time}
                    <SpotArt
                      src={ROW_SPOTS[i].src}
                      alt={ROW_SPOTS[i].alt}
                      className="w-12 sm:w-16 mt-4 opacity-90"
                      rotate={i % 2 === 0 ? -3 : 3}
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl tracking-tight text-[#1A1A1A]">{item.title}</h3>
                    <p className="font-body text-[#595959] mt-2 text-[0.95rem] leading-relaxed">{item.description}</p>
                    {item.note && (
                      <p className="font-body italic text-[#595959]/80 text-sm mt-2">{item.note}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.15}>
              <figure className="border border-[#1A1A1A]/25 bg-[#F2EFE9] p-2.5">
                <img
                  src="/illustrations/evening.png"
                  alt="Ink-and-wash illustration of cocktail glasses waiting in formation while a waiter carries an elegant tray"
                  className="w-full h-64 object-cover"
                  loading="lazy"
                  data-testid="evening-illustration"
                />
                <figcaption className="font-label text-[0.6rem] tracking-[0.16em] uppercase text-[#595959] pt-2.5 px-1">
                  The glasses have been briefed
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="bg-[#2C2C2C] text-[#F7F5F0] relative" data-testid="afterparty-block">
        <SpotArt
          src="/illustrations/spot-bowtie.png"
          alt="Ink drawing of a bow tie hanging from a taxi's rearview mirror"
          className="hidden lg:block absolute left-10 bottom-10 w-24 opacity-80 invert-[0.85] mix-blend-screen"
          rotate={-4}
        />
        <SpotArt
          src="/illustrations/spot-later.png"
          alt="Ink drawing of a champagne coupe beside a wristwatch showing a late hour"
          className="hidden lg:block absolute right-10 top-10 w-24 opacity-80 invert-[0.85] mix-blend-screen"
          rotate={3}
        />
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="font-label text-[0.65rem] tracking-[0.24em] uppercase text-[#F7F5F0]/50">{afterParty.time}</p>
              <h3 className="font-display text-4xl sm:text-5xl tracking-tight mt-4">{afterParty.title}</h3>
              <p className="font-body text-[#F7F5F0]/75 mt-5 leading-relaxed max-w-md">{afterParty.description}</p>
              <p className="font-label text-[0.62rem] tracking-[0.2em] uppercase text-[#D9B340] mt-8">
                Details to follow — pace yourself accordingly
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal delay={0.12}>
              <figure className="border border-[#F7F5F0]/25 p-2.5">
                <img
                  src="/illustrations/taxi.png"
                  alt="Ink-and-wash illustration of a taxi carrying a pair of evening shoes through Manhattan at night"
                  className="w-full h-56 object-cover"
                  loading="lazy"
                  data-testid="afterparty-illustration"
                />
                <figcaption className="font-label text-[0.6rem] tracking-[0.16em] uppercase text-[#F7F5F0]/55 pt-2.5 px-1">
                  The evening shoes travel separately
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Evening;
