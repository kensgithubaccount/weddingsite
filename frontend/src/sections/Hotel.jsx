import { Reveal } from "@/components/Reveal";

const HOTELS = [
  {
    name: "JW Marriott Essex House New York",
    walk: "1-minute walk",
    body: "The closest option, by a lot. Your walk to the wedding is mostly just leaving the hotel.",
    hotelUrl: "https://www.marriott.com/en-us/hotels/nycex-jw-marriott-essex-house-new-york/overview/",
    imageUrl: "https://images1.loopnet.com/i2/ZTa9t1JHxnKpgE2RzJm775U6ZijpaDJ_FE5LAbXvCNc/112/image.jpg",
    imageAlt: "JW Marriott Essex House on Central Park South",
  },
  {
    name: "Park Central Hotel New York",
    walk: "5-minute walk",
    body: "A short walk from the NYAC and a little closer to the Theater District. But please remember you have plans Saturday night.",
    hotelUrl: "https://www.parkcentralny.com/",
    imageUrl: "https://assets.talentronic.com/photos/employers/257735/709957_o.jpg",
    imageAlt: "Park Central Hotel New York",
  },
  {
    name: "Hilton Garden Inn New York/Central Park South-Midtown West",
    walk: "10-minute walk",
    body: "A little farther west, but still an easy walk to the wedding by New York standards.",
    hotelUrl: "https://www.hilton.com/en/hotels/nycwfgi-hilton-garden-inn-new-york-central-park-south-midtown-west/",
    imageUrl: "https://bynder.onthebeach.co.uk/cdn-cgi/image/width%3D1400%2Cquality%3D80%2Cfit%3Dcover%2Cformat%3Dauto/m/6d010ff17b4753b5/original/Hilton-Garden-Inn-New-York-Central-Park-South-Midt-General-view-7.jpg",
    imageAlt: "Hilton Garden Inn New York Central Park South entrance",
  },
];

const HotelCard = ({ hotel, index }) => (
  <article
    className={[
      "snap-start shrink-0 w-[82vw] sm:w-[68vw] md:w-auto md:shrink",
      "md:px-7 lg:px-9",
      index > 0 ? "md:border-l md:border-[#1D3F2C]/18" : "",
    ].join(" ")}
  >
    <div className="flex items-center gap-4 mb-5">
      <span className="font-label text-[0.68rem] tracking-[0.18em] text-[#1D3F2C]/75">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="h-px flex-1 bg-[#1D3F2C]/25" />
    </div>

    <div className="aspect-[4/3] overflow-hidden bg-[#E7E2D7]">
      <img
        src={hotel.imageUrl}
        alt={hotel.imageAlt}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover grayscale-[10%]"
      />
    </div>

    <div className="pt-6 flex flex-col min-h-[17rem] md:min-h-[19rem]">
      <h3 className="font-display text-[1.8rem] sm:text-[2rem] md:text-[1.75rem] lg:text-[2rem] tracking-tight leading-[1.02]">
        {hotel.name}
      </h3>

      <p className="font-label text-[0.62rem] tracking-[0.25em] uppercase text-[#1D3F2C]/65 mt-4">
        {hotel.walk}
      </p>

      <p className="font-body text-base md:text-[1.02rem] leading-relaxed text-[#1D3F2C]/82 mt-5">
        {hotel.body}
      </p>

      <div className="mt-auto pt-7">
        <a
          href={hotel.hotelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-between gap-8 min-w-[12rem] bg-[#1D3F2C] text-[#F7F5F0] px-5 py-4 font-label text-[0.62rem] tracking-[0.22em] uppercase hover:bg-[#173424] transition-colors"
          data-testid={`hotel-view-link-${index + 1}`}
        >
          <span>View Hotel</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </article>
);

const Hotel = () => (
  <section
    id="hotel"
    className="relative bg-[#F7F5F0] text-[#1D3F2C]"
    data-testid="hotel-section"
  >
    <div className="max-w-7xl mx-auto px-5 md:px-10 py-14 md:py-20">
      <Reveal>
        <div className="text-center mb-9 md:mb-12">
          <p className="font-label text-[0.64rem] tracking-[0.28em] uppercase text-[#1D3F2C]/65">
            Where to Stay
          </p>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.92] mt-4">
            Stay Close.
          </h2>
        </div>

        <div className="-mx-5 px-5 md:mx-0 md:px-0 overflow-x-auto md:overflow-visible">
          <div className="flex gap-5 pb-5 md:grid md:grid-cols-3 md:gap-0 md:pb-0 snap-x snap-mandatory md:snap-none">
            {HOTELS.map((hotel, index) => (
              <HotelCard key={hotel.name} hotel={hotel} index={index} />
            ))}
          </div>
        </div>

        <p className="md:hidden font-label text-[0.58rem] tracking-[0.2em] uppercase text-[#1D3F2C]/50 text-center mt-1">
          Swipe for more
        </p>
      </Reveal>
    </div>
  </section>
);

export default Hotel;
