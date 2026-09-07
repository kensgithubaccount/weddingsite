import { Reveal } from "@/components/Reveal";

const TaxiTopper = () => (
  <div className="relative bg-[#D6A51D] px-4 sm:px-8 py-8 md:py-12 overflow-hidden">
    <div className="absolute inset-x-0 bottom-0 h-3 bg-[#1A1A1A]" aria-hidden="true" />
    <div className="max-w-4xl mx-auto border-[10px] sm:border-[14px] border-[#1A1A1A] rounded-t-[2rem] bg-[#F7F5F0] px-6 sm:px-12 py-7 sm:py-9 text-center shadow-[0_14px_35px_rgba(0,0,0,0.25)]">
      <p className="font-std font-semibold uppercase tracking-tight text-[#1D3F2C] text-2xl sm:text-4xl leading-tight">
        Sophie Knochenhauer &amp; Ken Syme
      </p>
      <div className="w-28 sm:w-40 h-px bg-[#1D3F2C]/70 mx-auto my-4" />
      <p className="font-label text-[0.62rem] sm:text-[0.72rem] tracking-[0.34em] uppercase text-[#1A1A1A]">
        June Fifth 2027
      </p>
      <p className="font-label text-[0.55rem] sm:text-[0.62rem] tracking-[0.24em] uppercase text-[#595959] mt-2">
        New York, New York
      </p>
    </div>
  </div>
);

const SubwayCampaign = () => (
  <div className="bg-[#183B2A] p-4 sm:p-6 md:p-8">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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

      <div className="bg-[#F7F5F0] min-h-[220px] sm:min-h-[300px] p-5 sm:p-7 flex flex-col justify-center text-center">
        <p className="font-label text-[0.5rem] tracking-[0.24em] uppercase text-[#595959]">New York City</p>
        <p className="font-std font-semibold tracking-[-0.06em] text-[#1D3F2C] text-5xl sm:text-6xl my-5">06.05.27</p>
        <p className="font-label text-[0.5rem] tracking-[0.22em] uppercase text-[#595959]">New York Athletic Club</p>
      </div>

      <div className="bg-[#F7F5F0] min-h-[220px] sm:min-h-[300px] p-5 sm:p-7 flex flex-col justify-between">
        <p className="font-label text-[0.5rem] tracking-[0.22em] uppercase text-[#595959]">Vol. I · No. 1</p>
        <p className="font-std font-semibold uppercase tracking-[-0.04em] text-[#1D3F2C] text-4xl sm:text-5xl leading-[0.9]">The<br />Wedding<br />Issue</p>
        <p className="font-label text-[0.5rem] tracking-[0.22em] uppercase text-[#595959]">Issued to friends &amp; family</p>
      </div>
    </div>
  </div>
);

export const AdvertisingBreak = ({ variant = "taxi" }) => (
  <section className="py-6 md:py-10" aria-label="Wedding campaign artwork">
    <div className="max-w-7xl mx-auto px-5 md:px-10">
      <Reveal>
        <figure className="border border-[#1A1A1A]/20 bg-[#F2EFE9] p-2 md:p-2.5">
          {variant === "subway" ? <SubwayCampaign /> : <TaxiTopper />}
        </figure>
      </Reveal>
    </div>
  </section>
);
