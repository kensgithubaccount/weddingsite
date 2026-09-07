import { Reveal } from "@/components/Reveal";

const SubwayCampaign = () => (
  <div className="bg-[#183B2A] p-4 sm:p-6 md:p-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
      <div className="bg-[#F7F5F0] min-h-[220px] sm:min-h-[300px] p-5 sm:p-7 flex flex-col justify-between">
        <p className="font-label text-[0.55rem] tracking-[0.25em] uppercase text-[#1A1A1A]">Sophie + Ken</p>
        <p className="font-std font-semibold uppercase tracking-[-0.04em] text-[#1D3F2C] text-5xl sm:text-7xl leading-[0.78]">June<br />Fifth</p>
        <p className="font-label text-[0.5rem] tracking-[0.22em] uppercase text-[#595959]">Two thousand twenty-seven</p>
      </div>

      <div className="bg-[#F7F5F0] min-h-[220px] sm:min-h-[300px] p-3 flex flex-col">
        <img
          src="/photos/sophie-ken-bw.jpg"
          alt="Sophie and Ken laughing together"
          loading="lazy"
          className="w-full flex-1 min-h-0 object-cover grayscale"
        />
        <p className="font-label text-[0.5rem] sm:text-[0.55rem] tracking-[0.18em] uppercase text-center text-[#1A1A1A] pt-3">
          Sophie Knochenhauer &amp; Ken Syme
        </p>
      </div>

      <div className="bg-[#F7F5F0] min-h-[220px] sm:min-h-[300px] p-5 sm:p-7 flex flex-col justify-between text-center">
        <p className="font-label text-[0.5rem] tracking-[0.24em] uppercase text-[#595959]">New York City</p>
        <div className="my-auto py-6">
          <p className="font-std font-semibold uppercase tracking-[-0.05em] text-[#1D3F2C] text-4xl sm:text-5xl leading-[0.9]">New York<br />Athletic Club</p>
          <div className="w-14 h-px bg-[#1D3F2C]/45 mx-auto my-5" />
          <p className="font-label text-[0.55rem] sm:text-[0.62rem] tracking-[0.2em] uppercase text-[#1A1A1A] leading-loose">
            180 Central Park South<br />New York, New York
          </p>
        </div>
        <p className="font-label text-[0.5rem] tracking-[0.22em] uppercase text-[#595959]">June 5, 2027</p>
      </div>
    </div>
  </div>
);

export const AdvertisingBreak = ({ variant = "subway" }) => (
  <section className="py-6 md:py-10" aria-label="Wedding campaign artwork">
    <div className="max-w-7xl mx-auto px-5 md:px-10">
      <Reveal>
        <figure className="border border-[#1A1A1A]/20 bg-[#F2EFE9] p-2 md:p-2.5">
          <SubwayCampaign />
        </figure>
      </Reveal>
    </div>
  </section>
);
