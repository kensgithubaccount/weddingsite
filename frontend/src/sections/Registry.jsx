import { Reveal, SectionHeading } from "@/components/Reveal";
import { useContent } from "@/lib/content";

const Registry = () => {
  const { registry } = useContent();

  return (
    <section id="registry" className="py-24 md:py-32" data-testid="registry-section">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeading index={8} label="Registry" title="A Short Word on Gifts" />
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <Reveal className="lg:col-span-6 lg:col-start-4 text-center">
            <p className="font-body text-[#1A1A1A] text-base md:text-lg leading-[1.9]" data-testid="registry-note">
              {registry.note}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Registry;
