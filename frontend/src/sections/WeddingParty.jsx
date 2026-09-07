import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/Reveal";
import { useContent } from "@/lib/content";

const WeddingParty = () => {
  const { wedding_party: party } = useContent();
  const [active, setActive] = useState(null);

  return (
    <section id="wedding-party" className="py-16 md:py-24 bg-[#F2EFE9] border-t border-[#1A1A1A]/10" data-testid="wedding-party-section">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="mb-10 md:mb-14">
          <Reveal>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#1A1A1A]">{party.headline}</h2>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-6 max-w-2xl text-[#595959] text-base md:text-lg leading-relaxed">
              <p className="font-body italic text-sm text-[#595959]/85">{party.secondary}</p>
            </div>
          </Reveal>
        </div>

        {/* Desktop: two-column name list — scales to a full party of 14+ */}
        <div className="hidden lg:grid grid-cols-2 gap-x-16" role="list" aria-label="Wedding party">
          {party.members.map((m, i) => (
            <Reveal key={i} delay={Math.min(i * 0.03, 0.3)}>
              <button
                role="listitem"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={`w-full text-left grid grid-cols-[3rem_1fr] gap-4 py-4 rule-fine group transition-colors ${
                  active === i ? "text-[#1D3F2C]" : "text-[#1A1A1A]"
                }`}
                data-testid={`party-member-${i}`}
              >
                <span className={`font-label text-[0.65rem] tracking-[0.1em] pt-1.5 ${active === i ? "text-[#1D3F2C]" : "text-[#595959]/60"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="font-display text-2xl tracking-tight block group-hover:text-[#1D3F2C] transition-colors">
                    {m.name}
                  </span>
                  <span className="font-label text-[0.62rem] tracking-[0.2em] uppercase text-[#595959]">{m.role}</span>
                  <AnimatePresence>
                    {active === i && (
                      <motion.span
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="block overflow-hidden"
                      >
                        <span className="block font-body text-sm text-[#595959] leading-relaxed pt-2 max-w-md">{m.bio}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        {/* Mobile: accordion */}
        <div className="lg:hidden">
          <Accordion type="single" collapsible data-testid="party-accordion">
            {party.members.map((m, i) => (
              <AccordionItem key={i} value={`p-${i}`} className="border-b border-[#1A1A1A]/15 first:border-t">
                <AccordionTrigger
                  className="hover:no-underline py-5 text-left"
                  data-testid={`party-member-mobile-${i}`}
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-label text-[0.62rem] tracking-[0.1em] text-[#1D3F2C]">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="font-display text-xl tracking-tight text-[#1A1A1A] block">{m.name}</span>
                      <span className="font-label text-[0.58rem] tracking-[0.2em] uppercase text-[#595959]">{m.role}</span>
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <p className="font-body text-sm text-[#595959] leading-relaxed">{m.bio}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default WeddingParty;
