import { ExternalLink } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { useContent } from "@/lib/content";

const Registry = () => {
  const { registry } = useContent();

  return (
    <section id="registry" className="py-24 md:py-32" data-testid="registry-section">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeading index={8} label="Registry" title="A Short Word on Gifts" />

        <div className="grid grid-cols-1 lg:grid-cols-12 mb-14">
          <Reveal className="lg:col-span-6 lg:col-start-4 text-center">
            <p className="font-body text-[#1A1A1A] text-base md:text-lg leading-[1.9]" data-testid="registry-note">
              {registry.note}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {registry.entries.map((entry, i) => (
            <Reveal key={entry.name} delay={i * 0.08}>
              <div className="rule-fine pt-6 h-full flex flex-col" data-testid={`registry-card-${i}`}>
                <p className="overline-label text-[#731F17]">{entry.kind}</p>
                <h3 className="font-display text-2xl tracking-tight mt-3 text-[#1A1A1A]">{entry.name}</h3>
                <p className="font-body text-sm text-[#595959] leading-relaxed mt-3 flex-1">{entry.note}</p>
                {entry.url ? (
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-label text-[0.68rem] tracking-[0.16em] uppercase border border-[#1A1A1A]/50 px-5 py-3 mt-6 self-start hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors"
                    data-testid={`registry-link-${i}`}
                  >
                    Visit <ExternalLink size={13} />
                  </a>
                ) : (
                  <p className="font-label text-[0.62rem] tracking-[0.18em] uppercase text-[#595959]/60 mt-6" data-testid={`registry-pending-${i}`}>
                    Link to come
                  </p>
                )}
                {entry._status === "placeholder" && (
                  <p className="font-body italic text-[#595959]/60 text-xs mt-3">Sample — to be replaced by the couple</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Registry;
