import { toast } from "sonner";
import { CalendarPlus, Copy, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { useContent } from "@/lib/content";

const Invitation = () => {
  const content = useContent();
  const { venue, date } = content;

  const addToCalendar = () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Sophie + Ken//Wedding//EN",
      "BEGIN:VEVENT",
      "UID:sophie-ken-2027@sophieandken",
      "DTSTAMP:20260701T120000Z",
      "DTSTART:20270605T213000Z",
      "DTEND:20270606T033000Z",
      "SUMMARY:Sophie + Ken — Wedding",
      `LOCATION:${venue.name}\\, ${venue.address}\\, ${venue.city}`,
      "DESCRIPTION:Arrival 5:30 PM · Cocktail hour 6:30 PM · Ceremony and celebration 7:30–11:30 PM · After-party to follow",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sophie-and-ken-june-5-2027.ics";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Saved to your calendar — June 5, 2027.");
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(`${venue.name}, ${venue.address}, ${venue.city}`);
    toast.success("Address copied. The doorman will take it from here.");
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.maps_query)}`;

  return (
    <section id="invitation" className="py-24 md:py-36" data-testid="invitation-section">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeading index={1} label="The Invitation" title="Request the Pleasure of Your Company" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 lg:col-start-3 text-center">
            <Reveal>
              <p className="font-display text-3xl sm:text-4xl tracking-tight text-[#1A1A1A] leading-snug">
                {content.couple.partner_one}
              </p>
              <p className="font-label text-[0.65rem] tracking-[0.3em] uppercase text-[#731F17] my-4">and</p>
              <p className="font-display text-3xl sm:text-4xl tracking-tight text-[#1A1A1A] leading-snug">
                {content.couple.partner_two}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="font-label text-[0.68rem] tracking-[0.26em] uppercase text-[#595959] mt-10 leading-loose">
                request the pleasure of your company
                <br />
                at their wedding
              </p>
              <p className="font-display text-2xl sm:text-3xl mt-8 text-[#1A1A1A]">{date.display}</p>
              <p className="font-body text-[#595959] mt-4 leading-relaxed">
                {venue.name}
                <br />
                {venue.address}
                <br />
                {venue.city}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="rule-fine mt-12 pt-10 flex flex-wrap justify-center gap-3">
                <button
                  onClick={addToCalendar}
                  className="flex items-center gap-2 font-label text-[0.68rem] tracking-[0.16em] uppercase border border-[#1A1A1A]/50 px-5 py-3 hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors"
                  data-testid="add-to-calendar-button"
                >
                  <CalendarPlus size={14} /> Add to calendar
                </button>
                <button
                  onClick={copyAddress}
                  className="flex items-center gap-2 font-label text-[0.68rem] tracking-[0.16em] uppercase border border-[#1A1A1A]/50 px-5 py-3 hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors"
                  data-testid="copy-address-button"
                >
                  <Copy size={14} /> Copy address
                </button>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-label text-[0.68rem] tracking-[0.16em] uppercase border border-[#1A1A1A]/50 px-5 py-3 hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors"
                  data-testid="open-in-maps-button"
                >
                  <MapPin size={14} /> Open in maps
                </a>
                <Link
                  to="/rsvp"
                  className="flex items-center gap-2 font-label text-[0.68rem] tracking-[0.16em] uppercase bg-[#731F17] text-[#F7F5F0] px-5 py-3 hover:bg-[#5d1812] transition-colors"
                  data-testid="invitation-rsvp-button"
                >
                  RSVP
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Invitation;
