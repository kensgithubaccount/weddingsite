import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Seal } from "@/components/Seal";
import { scrollToId } from "@/hooks/useLenis";

const LINKS = [
  { id: "invitation", label: "Invitation" },
  { id: "evening", label: "The Evening" },
  { id: "story", label: "Our Story" },
  { id: "new-york", label: "New York" },
  { id: "travel", label: "Travel" },
  { id: "questions", label: "Questions" },
];

export const Nav = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const go = (id) => {
    setOpen(false);
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToId(id), 120);
    } else {
      scrollToId(id);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F7F5F0] border-b border-[#1A1A1A]/15" data-testid="main-nav">
      <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" data-testid="nav-home-link" aria-label="Sophie and Ken — home">
          <Seal size={34} />
          <span className="font-display font-semibold text-lg tracking-tight hidden xs:block sm:block">Sophie + Ken</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Sections">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="font-label text-[0.7rem] tracking-[0.18em] uppercase text-[#1A1A1A] link-underline"
              data-testid={`nav-link-${l.id}`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/rsvp"
            className="font-label text-[0.7rem] tracking-[0.18em] uppercase bg-[#731F17] text-[#F7F5F0] px-5 py-2.5 hover:bg-[#5d1812] transition-colors"
            data-testid="nav-rsvp-button"
          >
            RSVP
          </Link>
          <button
            className="lg:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            data-testid="nav-menu-toggle"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden border-t border-[#1A1A1A]/15 bg-[#F7F5F0]"
            aria-label="Mobile sections"
            data-testid="nav-mobile-menu"
          >
            <div className="px-6 py-6 flex flex-col gap-1">
              {LINKS.map((l, i) => (
                <button
                  key={l.id}
                  onClick={() => go(l.id)}
                  className="text-left font-display text-2xl py-3 border-b border-[#1A1A1A]/10 flex items-baseline gap-4"
                  data-testid={`nav-mobile-link-${l.id}`}
                >
                  <span className="font-label text-[0.6rem] tracking-[0.2em] text-[#731F17]">{String(i + 1).padStart(2, "0")}</span>
                  {l.label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
