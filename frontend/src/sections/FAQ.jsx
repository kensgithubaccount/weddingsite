import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal, SectionHeading } from "@/components/Reveal";
import SpotArt from "@/components/SpotArt";
import { useContent } from "@/lib/content";

const FAQ = () => {
  const { faqs } = useContent();

  return (
    <section id="questions" className="relative py-24 md:py-36" data-testid="faq-section">
      <SpotArt
        src="/illustrations/spot-gap.png"
        alt="Ink drawing of a dropped place card beside a Manhattan street grate"
        className="hidden xl:block absolute right-14 top-44 w-28 opacity-90"
        rotate={4}
      />
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeading index={5} label="Questions" title="Everything You Were About to Ask">
          <p>We tried to answer it before it became a text. Though if you have questions, feel free to text.</p>
        </SectionHeading>

        <Reveal>
          <figure className="border border-[#1A1A1A]/25 bg-[#F2EFE9] p-2.5 max-w-lg mb-14" data-testid="faq-figure">
            <img
              src="/illustrations/faq-suitcase.png"
              alt="Ink-and-wash illustration of an exceptionally prepared wedding guest beside an open suitcase with compartments labeled Ceremony, Weather, After-Party, Emergency Outfit #1, Emergency Outfit #2, and Questions for Ken"
              className="w-full h-64 object-cover"
              loading="lazy"
              onError={(e) => { e.currentTarget.closest("figure").style.display = "none"; }}
              data-testid="faq-illustration"
            />
            <figcaption className="font-body italic text-[#595959] text-sm pt-2.5 px-1 pb-1">
              Most of this is answered below.
            </figcaption>
          </figure>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-8 lg:col-start-3">
            <Accordion type="single" collapsible className="w-full" data-testid="faq-accordion">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={faq.q}
                  value={`q-${i}`}
                  className="border-b border-[#1A1A1A]/15 first:border-t"
                >
                  <AccordionTrigger
                    className="font-display text-xl sm:text-2xl tracking-tight text-[#1A1A1A] hover:no-underline hover:text-[#731F17] transition-colors py-6 text-left"
                    data-testid={`faq-question-${i}`}
                  >
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent
                    className="font-body text-[#595959] text-[0.95rem] leading-relaxed pb-6 max-w-2xl"
                    data-testid={`faq-answer-${i}`}
                  >
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
