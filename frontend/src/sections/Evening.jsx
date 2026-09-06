import { Reveal, SectionHeading } from "@/components/Reveal";
import { useContent } from "@/lib/content";

const Evening = () => {
  const content = useContent();
  const program = content.schedule;

  return (
    <section id="evening" data-testid="evening-section">
      <div className="py-28 md:py-44 max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeading index={2} label="The Evening" title="One evening, five parts." />

        <div className="max-w-3xl mx-auto">
          {program.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <div
                className="grid grid-cols-[92px_1fr] sm:grid-cols-[140px_1fr] gap-4 sm:gap-8 py-10 rule-fine first:border-t-0 first:pt-0"
                data-testid={`schedule-item-${i}`}
              >
                <div className="font-label text-[0.68rem] tracking-[0.14em] uppercase text-[#1D3F2C] pt-1.5 leading-relaxed">
                  {item.time}
                </div>
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl tracking-tight text-[#1A1A1A]">{item.title}</h3>
                  <p className="font-body text-[#595959] mt-2 text-[0.95rem] leading-relaxed">{item.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Evening;
