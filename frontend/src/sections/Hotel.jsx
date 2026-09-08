import { Reveal } from "@/components/Reveal";

const HOTEL_URL = "https://www.marriott.com/en-us/hotels/nycex-jw-marriott-essex-house-new-york/overview/";
const MAPS_URL = "https://maps.google.com/?q=JW%20Marriott%20Essex%20House%20New%20York";

const Hotel = () => (
  <section id="hotel" className="relative bg-[#1D3F2C] text-[#F7F5F0]" data-testid="hotel-section">
    <div className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-24">
      <Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end border-y border-[#F7F5F0]/20 py-10 md:py-14">
          <div className="lg:col-span-5">
            <p className="font-label text-[0.64rem] tracking-[0.28em] uppercase text-[#F7F5F0]/65">Room Block</p>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.92] mt-4">
              Stay Close.
            </h2>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <p className="font-display text-2xl sm:text-3xl tracking-tight leading-tight">
              JW Marriott Essex House New York
            </p>
            <p className="font-label text-[0.62rem] tracking-[0.18em] uppercase text-[#F7F5F0]/60 mt-3">
              160 Central Park South · New York, New York 10019
            </p>

            <p className="font-body text-base md:text-lg leading-relaxed text-[#F7F5F0]/85 mt-7 max-w-xl">
              We&rsquo;ll have a room block here, just down Central Park South from the New York Athletic Club.
            </p>
            <p className="font-body italic text-sm md:text-base leading-relaxed text-[#F7F5F0]/60 mt-3 max-w-xl">
              Booking details and the room-block link are coming soon.
            </p>

            <div className="flex flex-wrap gap-x-7 gap-y-3 mt-8">
              <a
                href={HOTEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-label text-[0.62rem] tracking-[0.2em] uppercase border-b border-[#F7F5F0]/45 pb-1 hover:border-[#F7F5F0] transition-colors"
                data-testid="hotel-view-link"
              >
                View Hotel
              </a>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-label text-[0.62rem] tracking-[0.2em] uppercase border-b border-[#F7F5F0]/45 pb-1 hover:border-[#F7F5F0] transition-colors"
                data-testid="hotel-maps-link"
              >
                Open in Maps
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default Hotel;
