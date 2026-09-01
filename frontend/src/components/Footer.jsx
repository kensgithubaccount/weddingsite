import { Link } from "react-router-dom";
import { Seal } from "@/components/Seal";

export const Footer = () => (
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
            <li><a href="/#invitation" className="link-underline" data-testid="footer-link-invitation">The Invitation</a></li>
            <li><a href="/#evening" className="link-underline" data-testid="footer-link-evening">The Evening</a></li>
            <li><a href="/#new-york" className="link-underline" data-testid="footer-link-new-york">New York</a></li>
            <li><a href="/#travel" className="link-underline" data-testid="footer-link-travel">Travel &amp; Stay</a></li>
            <li><a href="/#questions" className="link-underline" data-testid="footer-link-questions">Questions</a></li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="font-label text-[0.65rem] tracking-[0.22em] uppercase text-[#F7F5F0]/50 mb-5">Correspondence</p>
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
        </div>
      </div>
      <div className="rule-fine border-[#F7F5F0]/15 mt-16 pt-6 flex flex-col sm:flex-row justify-between gap-3">
        <p className="font-label text-[0.6rem] tracking-[0.2em] uppercase text-[#F7F5F0]/45">
          Vol. I · No. 1 · The Wedding Issue · One Night Only
        </p>
      </div>
    </div>
  </footer>
);
