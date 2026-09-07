import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { useContent } from "@/lib/content";

const FAQ = () => {
  const { faqs } = useContent();

  return (
    <section id="questions" className="relative py-16 md:py-24" data-testid="faq-section">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeading index={5} label="Questions" title="Everything You Were About to Ask">
          <p>We tried to answer it before it became a text. Though if you have questions, feel free to text.</p>
        </SectionHeading>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-8 lg:col-start-3">
            <Accordion type="single" collapsible className="w-full" data-testid="faq-accordion">
              {faqs.map((faq, i) => {
                const answer = faq.q === "Is the wedding indoors?" ? `Yes. ${faq.a}` : faq.a;
                return (
                  <AccordionItem
                    key={faq.q}
                    value={`q-${i}`}
                    className="border-b border-[#1A1A1A]/15 first:border-t"
                  >
                    <AccordionTrigger
                      className="font-display text-xl sm:text-2xl tracking-tight text-[#1A1A1A] hover:no-underline hover:text-[#1D3F2C] transition-colors py-6 text-left"
                      data-testid={`faq-question-${i}`}
                    >
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent
                      className="font-body text-[#595959] text-[0.95rem] leading-relaxed pb-6 max-w-2xl"
                      data-testid={`faq-answer-${i}`}
                    >
                      {answer}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
