import { Reveal, SectionHeading } from "@/components/Reveal";
import SpotArt from "@/components/SpotArt";
import { useContent } from "@/lib/content";

const Contact = () => {
  const { contacts } = useContent();

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-[#F2EFE9]" data-testid="contact-section">
      <SpotArt
        src="/illustrations/spot-key.png"
        alt="Ink drawing of a vintage key with a leather tag marked June 5"
        className="hidden xl:block absolute right-14 top-36 w-24 opacity-90"
        rotate={5}
      />
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeading index={9} label="Contact" title="Correspondence">
          <p>One address per kind of question. All of them read by a human.</p>
        </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contacts.map((c, i) => {
            const email = `${c.user}@${c.domain}`;
            return (
              <Reveal key={c.label} delay={i * 0.08}>
                <div className="rule-fine pt-6" data-testid={`contact-card-${i}`}>
                  <p className="overline-label text-[#731F17]">{c.label}</p>
                  <p className="font-display text-2xl tracking-tight mt-3 text-[#1A1A1A]">{c.name}</p>
                  <a
                    href={`mailto:${email}`}
                    className="inline-block font-label text-[0.72rem] tracking-[0.12em] text-[#1A1A1A] link-underline mt-4"
                    data-testid={`contact-email-${i}`}
                  >
                    {c.user} [at] {c.domain}
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Contact;
