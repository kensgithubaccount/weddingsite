import { motion } from "framer-motion";
import { SectionHeading } from "@/components/Reveal";
import { useContent } from "@/lib/content";

const Evening = () => {
  const content = useContent();
  const program = content.schedule;

  return (
    <section id="evening" data-testid="evening-section">
      <div className="py-16 md:py-24 max-w-7xl mx-auto px-5 md:px-10 overflow-visible">
        <div className="max-w-5xl mx-auto">
          <SectionHeading title="The Details" />

          <div className="border-y border-[#1A1A1A]/20">
            {program.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0.4, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.52 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-[88px_1px_1fr] sm:grid-cols-[140px_1px_1fr] gap-5 sm:gap-8 py-7 md:py-8 border-t border-[#1A1A1A]/12 first:border-t-0"
                data-testid={`schedule-item-${i}`}
              >
                <div className="font-label text-[0.68rem] tracking-[0.12em] uppercase text-[#1D3F2C] pt-1.5 leading-relaxed whitespace-nowrap">
                  {item.time}
                </div>

                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: false, amount: 0.55 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="w-px bg-[#1D3F2C]/45 self-stretch origin-top"
                  aria-hidden="true"
                />

                <div className="pb-1">
                  <h3 className="font-display text-2xl sm:text-[1.7rem] tracking-tight text-[#1A1A1A] leading-none">
                    {item.title.replace(/^The\s+/i, "")}
                  </h3>
                  <p className="font-body text-[#595959] mt-2 text-[0.95rem] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
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
