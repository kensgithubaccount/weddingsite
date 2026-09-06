import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/Reveal";
import { useContent } from "@/lib/content";

const Portrait = ({ member, index }) => {
  const [imgOk, setImgOk] = useState(true);
  return (
    <div className="border border-[#1A1A1A]/25 bg-[#F7F5F0] p-2.5 h-full" data-testid="party-portrait-frame">
      {imgOk ? (
        <img
          src="/illustrations/portrait-placeholder.png"
          alt={member ? `Portrait of ${member.name}, ${member.role} — illustration to come` : "The wedding party, illustrated together at a Manhattan crosswalk"}
          className="w-full h-80 lg:h-[26rem] object-cover"
          loading="lazy"
          onError={() => setImgOk(false)}
          data-testid="party-portrait-image"
        />
      ) : (
        <div className="w-full h-80 lg:h-[26rem] flex items-center justify-center">
          <p className="font-display italic text-2xl text-[#595959]/60 px-8 text-center">
            {member ? `${member.name} — portrait to come` : "Group portrait to come"}
          </p>
        </div>
      )}
      <p className="font-label text-[0.6rem] tracking-[0.16em] uppercase text-[#595959] pt-2.5 px-1 flex justify-between">
        <span>{member ? member.role : "The full party, assembled"}</span>
        <span>{member ? `Fig. ${index + 1}` : "Fig. 0"}</span>
      </p>
    </div>
  );
};

const WeddingParty = () => {
  const { wedding_party: party } = useContent();
  const [active, setActive] = useState(null);

  return (
    <section id="wedding-party" className="py-24 md:py-36 bg-[#F2EFE9] border-t border-[#1A1A1A]/10" data-testid="wedding-party-section">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="mb-14 md:mb-20">
          <Reveal>
            <div className="flex items-baseline justify-between rule-fine pt-4 mb-10">
              <span className="overline-label" data-testid="section-label-the-wedding-party">{party.label}</span>
              <span className="overline-label hidden sm:block">Special Feature</span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#1A1A1A]">{party.headline}</h2>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-6 max-w-2xl text-[#595959] text-base md:text-lg leading-relaxed">
              <p className="font-body italic text-sm text-[#595959]/85">{party.secondary}</p>
            </div>
          </Reveal>
        </div>

        {/* Desktop: contributors list + portrait */}
        <div className="hidden lg:grid grid-cols-12 gap-12">
          <div className="lg:col-span-5" role="list" aria-label="Wedding party">
            {party.members.map((m, i) => (
              <Reveal key={i} delay={i * 0.03}>
                <button
                  role="listitem"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  className={`w-full text-left grid grid-cols-[3rem_1fr] gap-4 py-4 rule-fine first:border-t-0 group transition-colors ${
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
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="sticky top-24">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active === null ? "group" : active}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Portrait member={active === null ? null : party.members[active]} index={active || 0} />
                </motion.div>
              </AnimatePresence>
              <p className="font-body italic text-[#595959]/70 text-xs mt-3">
                Portraits are being drawn from real photographs. Names to come.
              </p>
            </div>
          </div>
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
                  <div className="border border-[#1A1A1A]/25 bg-[#F7F5F0] p-2 mb-4">
                    <img
                      src="/illustrations/portrait-placeholder.png"
                      alt={`Portrait of ${m.name} — illustration to come`}
                      className="w-full h-56 object-cover"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  </div>
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
