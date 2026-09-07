import { toast } from "sonner";
import { CalendarPlus, Copy, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { useContent } from "@/lib/content";
import { phaseConfig } from "@/lib/sitePhase";

const Invitation = () => {
  const content = useContent();
  const { venue, date, invitation } = content;

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
      "DESCRIPTION:Arrival 5:30 PM · Ceremony 6:00 PM · Cocktail hour 6:30 PM · Reception 7:30–11:30 PM · After-party to follow",
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
    <section id="invitation" className="relative pt-14 md:pt-20 pb-16 md:pb-24" data-testid="invitation-section">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeading index={1} label="The Invitation" title="The Details" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 lg:col-start-3 text-center">
            <Reveal>
              <div className="max-w-2xl mx-auto">
                <p className="font-display text-lg sm:text-xl text-[#1A1A1A] leading-relaxed" data-testid="invitation-host-line">
                  {invitation.hosts}
                </p>
                <p className="font-body italic text-[#595959] text-[0.95rem] leading-loose mt-7">
                  {invitation.request_line_one}
                  <br />
                  {invitation.request_line_two}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-16 md:mt-24">
                <p className="font-std font-bold uppercase tracking-tight text-[#1A1A1A] text-5xl sm:text-6xl lg:text-[4.8rem] leading-[0.96]" data-testid="invitation-name-one">
                  {content.couple.partner_one}
                </p>
                <p className="font-label text-[0.62rem] tracking-[0.34em] uppercase text-[#1D3F2C] my-7">and</p>
                <p className="font-std font-bold uppercase tracking-tight text-[#1A1A1A] text-5xl sm:text-6xl lg:text-[4.8rem] leading-[0.96]" data-testid="invitation-name-two">
                  {content.couple.partner_two}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="rule-fine mt-16 pt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-9" data-testid="invitation-info">
                <div>
                  <p className="overline-label">Saturday</p>
                  <p className="font-std font-bold uppercase tracking-tight text-[#1D3F2C] text-3xl sm:text-[2.15rem] mt-3">{date.short}</p>
                </div>
                <div>
                  <p className="overline-label">Arrival</p>
                  <p className="font-display text-2xl text-[#1A1A1A] mt-2">{content.schedule[0].time}</p>
                </div>
                <div className="sm:col-span-2 pt-2">
                  <p className="font-display text-2xl text-[#1A1A1A]">{venue.name}</p>
                  <p className="font-body text-[#595959] mt-2 leading-relaxed">
                    {venue.address}
                    <br />
                    {venue.city}
                  </p>
                </div>
                <p className="sm:col-span-2 overline-label text-[#1D3F2C]">{content.attire.headline}</p>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-12 flex flex-wrap justify-center gap-3">
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
                {phaseConfig.rsvpEnabled && (
                  <Link
                    to="/rsvp"
                    className="flex items-center gap-2 font-label text-[0.68rem] tracking-[0.16em] uppercase bg-[#1D3F2C] text-[#F7F5F0] px-5 py-3 hover:bg-[#142B1F] transition-colors"
                    data-testid="invitation-rsvp-button"
                  >
                    RSVP
                  </Link>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Invitation;
