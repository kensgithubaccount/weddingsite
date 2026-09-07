import { Reveal } from "@/components/Reveal";

export const AdvertisingBreak = ({ src, alt, compact = false }) => (
  <section className="py-6 md:py-10" aria-label="Wedding campaign artwork">
    <div className={`${compact ? "max-w-5xl" : "max-w-7xl"} mx-auto px-5 md:px-10`}>
      <Reveal>
        <figure className="border border-[#1A1A1A]/20 bg-[#F2EFE9] p-2 md:p-2.5">
          <div className={`overflow-hidden ${compact ? "max-h-[560px]" : "max-h-[480px]"}`}>
            <img
              src={src}
              alt={alt}
              loading="lazy"
              className={`w-full block object-cover ${compact ? "aspect-[4/3]" : "aspect-[16/7]"}`}
            />
          </div>
        </figure>
      </Reveal>
    </div>
  </section>
);
