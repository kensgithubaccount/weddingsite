import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Seal } from "@/components/Seal";
import { useContent } from "@/lib/content";

const ALL_ITEMS = [
  { num: "01", label: "Home", anchor: "cover", always: true },
  { num: "02", label: "Invitation", anchor: "invitation", always: true },
  { num: "03", label: "The Evening", anchor: "evening", always: true },
  { num: "04", label: "Our Story", anchor: "story", key: "story" },
  { num: "05", label: "New York", anchor: "new-york", key: "ny_guide" },
  { num: "06", label: "Travel", anchor: "travel", key: "travel" },
  { num: "07", label: "Attire", anchor: "attire", key: "attire" },
  { num: "08", label: "Questions", anchor: "questions", always: true },
  { num: "09", label: "RSVP", anchor: "rsvp", isRsvp: true, always: true },
  { num: "10", label: "Registry", anchor: "registry", key: "registry" },
  { num: "11", label: "Contact", anchor: "contact", always: true },
];

export const scrollToAnchor = (anchor) => {
  if (anchor === "cover") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(anchor);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const VerticalRail = () => {
  const content = useContent();
  const [active, setActive] = useState("cover");

  const navList = useMemo(
    () => ALL_ITEMS.filter((s) => s.always || content[s.key]?.published),
    [content]
  );

  useEffect(() => {
    const sections = navList
      .filter((s) => !s.isRsvp)
      .map((s) => (s.anchor === "cover" ? document.getElementById("hero-cover") : document.getElementById(s.anchor)))
      .filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id === "hero-cover" ? "cover" : entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [navList]);

  return (
    <nav
      aria-label="Section navigation"
      className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-4"
      data-testid="vertical-rail"
    >
      <button
        onClick={() => scrollToAnchor("cover")}
        aria-label="Sophie and Ken — home"
        className="mb-2 transition-transform hover:scale-105"
        data-testid="rail-seal"
      >
        <Seal size={52} />
      </button>
      <div className="w-px h-6 bg-[#1A1A1A]/20" />
      <ul className="flex flex-col items-center gap-3.5">
        {navList.map((item) => {
          if (item.isRsvp) {
            return (
              <li key={item.anchor}>
                <Link to="/rsvp" className="flex flex-col items-center gap-1 group" data-testid="rail-link-rsvp">
                  <span className="font-label font-bold text-[0.6rem] tracking-[0.08em] text-[#731F17] border border-[#731F17] rounded-sm px-1.5 py-0.5 group-hover:bg-[#731F17] group-hover:text-[#F7F5F0] transition-colors">
                    {item.num}
                  </span>
                  <span className="font-label text-[0.55rem] tracking-[0.24em] uppercase text-[#731F17]">RSVP</span>
                </Link>
              </li>
            );
          }
          const isActive = active === item.anchor;
          return (
            <li key={item.anchor}>
              <button
                onClick={() => scrollToAnchor(item.anchor)}
                aria-current={isActive ? "true" : undefined}
                className="flex flex-col items-center gap-1 group"
                data-testid={`rail-link-${item.anchor}`}
              >
                <span
                  className={`font-label text-[0.6rem] tracking-[0.08em] transition-colors ${
                    isActive ? "text-[#731F17] font-bold" : "text-[#595959]/70 group-hover:text-[#1A1A1A]"
                  }`}
                >
                  {item.num}
                </span>
                <span
                  className={`font-label text-[0.5rem] tracking-[0.22em] uppercase text-center leading-tight max-w-[4.5rem] transition-colors ${
                    isActive ? "text-[#731F17]" : "text-[#595959]/70 group-hover:text-[#1A1A1A]"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
