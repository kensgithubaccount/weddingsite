import { ExternalLink } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { useContent } from "@/lib/content";

const Registry = () => {
  const { registry } = useContent();

  return (
    <section id="registry" className="py-28 md:py-44" data-testid="registry-section">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeading index={6} label={registry.label} title={registry.headline}>
          <p>{registry.body}</p>
        </SectionHeading>

        <div className="max-w-3xl">
          {registry.entries.map((entry, i) => (
            <Reveal key={entry.name} delay={i * 0.06}>
              <div
                className="rule-fine first:border-t-0 py-6 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-baseline"
                data-testid={`registry-card-${i}`}
              >
                <div>
                  <p className="font-display text-2xl tracking-tight text-[#1A1A1A]">{entry.name}</p>
                  <p className="font-body text-sm text-[#595959] leading-relaxed mt-1.5">
                    {entry.note}
                    {entry._status === "placeholder" && (
                      <span className="italic text-[#595959]/60"> (sample — to be replaced by the couple)</span>
                    )}
                  </p>
                </div>
                {entry.url ? (
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-label text-[0.65rem] tracking-[0.16em] uppercase text-[#1A1A1A] link-underline self-start"
                    data-testid={`registry-link-${i}`}
                  >
                    Visit <ExternalLink size={12} />
                  </a>
                ) : (
                  <p className="font-label text-[0.6rem] tracking-[0.18em] uppercase text-[#595959]/60" data-testid={`registry-pending-${i}`}>
                    Link to come
                  </p>
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
