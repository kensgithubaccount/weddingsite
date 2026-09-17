import { Reveal } from "@/components/Reveal";

const HOTELS = [
  {
    name: "JW Marriott Essex House New York",
    meta: "160 Central Park South · 1-minute walk · $$$$",
    body: "The closest option, by a lot. Your walk to the wedding is mostly just leaving the hotel.",
    hotelUrl: "https://www.marriott.com/en-us/hotels/nycex-jw-marriott-essex-house-new-york/overview/",
    mapsUrl: "https://maps.google.com/?q=JW%20Marriott%20Essex%20House%20New%20York",
  },
  {
    name: "Park Central Hotel New York",
    meta: "870 Seventh Avenue · 5-minute walk · $$$",
    body: "A short walk from the NYAC and a little closer to the Theater District. But please remember you have plans Saturday night.",
    hotelUrl: "https://www.parkcentralny.com/",
    mapsUrl: "https://maps.google.com/?q=Park%20Central%20Hotel%20New%20York",
  },
  {
    name: "Hilton Garden Inn New York/Central Park South-Midtown West",
    meta: "237 West 54th Street · 10-minute walk · $$",
    body: "A little farther west, but still an easy walk to the wedding by New York standards.",
    hotelUrl: "https://www.hilton.com/en/hotels/nycwfgi-hilton-garden-inn-new-york-central-park-south-midtown-west/",
    mapsUrl: "https://maps.google.com/?q=Hilton%20Garden%20Inn%20New%20York%20Central%20Park%20South%20Midtown%20West",
  },
];

const Hotel = () => (
  <section id="hotel" className="relative bg-[#1D3F2C] text-[#F7F5F0]" data-testid="hotel-section">
    <div className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-24">
      <Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start border-y border-[#F7F5F0]/20 py-10 md:py-14">
          <div className="lg:col-span-5">
            <p className="font-label text-[0.64rem] tracking-[0.28em] uppercase text-[#F7F5F0]/65">Where to Stay</p>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.92] mt-4">
              Stay Close.
            </h2>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            {HOTELS.map((hotel, index) => (
              <div
                key={hotel.name}
                className={index === 0 ? "" : "border-t border-[#F7F5F0]/20 mt-9 pt-9"}
              >
                <p className="font-display text-2xl sm:text-3xl tracking-tight leading-tight">
                  {hotel.name}
                </p>
                <p className="font-label text-[0.62rem] tracking-[0.18em] uppercase text-[#F7F5F0]/60 mt-3">
                  {hotel.meta}
                </p>

                <p className="font-body text-base md:text-lg leading-relaxed text-[#F7F5F0]/85 mt-5 max-w-xl">
                  {hotel.body}
                </p>

                <div className="flex flex-wrap gap-x-7 gap-y-3 mt-6">
                  <a
                    href={hotel.hotelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-label text-[0.62rem] tracking-[0.2em] uppercase border-b border-[#F7F5F0]/45 pb-1 hover:border-[#F7F5F0] transition-colors"
                    data-testid={`hotel-view-link-${index + 1}`}
                  >
                    View Hotel
                  </a>
                  <a
                    href={hotel.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-label text-[0.62rem] tracking-[0.2em] uppercase border-b border-[#F7F5F0]/45 pb-1 hover:border-[#F7F5F0] transition-colors"
                    data-testid={`hotel-maps-link-${index + 1}`}
                  >
                    Open in Maps
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default Hotel;
