import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { useContent } from "@/lib/content";

const FAQ = () => {
  const { faqs } = useContent();

  return (
    <section id="questions" className="py-24 md:py-36 bg-[#F2EFE9]" data-testid="faq-section">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeading index={7} label="Questions" title="Everything You Were Going to Ask">
          <p>Answers confirmed by the couple. Anything unconfirmed is simply not printed.</p>
        </SectionHeading>

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
