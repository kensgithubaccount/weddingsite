import { Link } from "react-router-dom";
import { Seal } from "@/components/Seal";
import { phaseConfig } from "@/lib/sitePhase";

export const Footer = () => {
  const s = phaseConfig.sections;

  return (
    <footer className="bg-[#2C2C2C] text-[#F7F5F0]" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Seal size={72} color="#F7F5F0" />
            <p className="font-display text-3xl mt-6 tracking-tight">Sophie + Ken</p>
            <p className="font-label text-[0.65rem] tracking-[0.22em] uppercase text-[#F7F5F0]/60 mt-3 leading-loose">
              Saturday, June 5, 2027
              <br />
              New York Athletic Club
              <br />
              180 Central Park South, New York, New York
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="font-label text-[0.65rem] tracking-[0.22em] uppercase text-[#F7F5F0]/50 mb-5">Contents</p>
            <ul className="space-y-3 font-body text-sm text-[#F7F5F0]/85">
              <li><a href="/#hero-cover" className="link-underline">Home</a></li>
              {s.evening && <li><a href="/#evening" className="link-underline">The Evening</a></li>}
              {s.story && <li><a href="/#story" className="link-underline">Our Story</a></li>}
              {s.hotel && <li><a href="/#hotel" className="link-underline">Stay</a></li>}
              {s.attire && <li><a href="/#attire" className="link-underline">Attire</a></li>}
              {s.questions && <li><a href="/#questions" className="link-underline">Questions</a></li>}
              {s.registry && <li><a href="/#registry" className="link-underline">Registry</a></li>}
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="font-label text-[0.65rem] tracking-[0.22em] uppercase text-[#F7F5F0]/50 mb-5">Correspondence</p>
            {phaseConfig.rsvpEnabled ? (
              <>
                <p className="font-body text-sm text-[#F7F5F0]/85 leading-relaxed">
                  Responses are kindly collected through the RSVP desk.
                </p>
                <Link
                  to="/rsvp"
                  className="inline-block mt-5 font-label text-[0.7rem] tracking-[0.18em] uppercase border border-[#F7F5F0]/70 px-6 py-3 hover:bg-[#F7F5F0] hover:text-[#2C2C2C] transition-colors"
                  data-testid="footer-rsvp-button"
                >
                  RSVP
                </Link>
              </>
            ) : (
              <p className="font-body text-sm text-[#F7F5F0]/85 leading-relaxed max-w-xs">
                Formal RSVP details will arrive with the invitation.
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
