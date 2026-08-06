import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Seal } from "@/components/Seal";
import { scrollToId } from "@/hooks/useLenis";

const ITEMS = [
  { n: "01", label: "Home", id: "home" },
  { n: "02", label: "Invitation", id: "invitation" },
  { n: "03", label: "The Evening", id: "evening" },
  { n: "04", label: "Our Story", id: "story" },
  { n: "05", label: "New York", id: "new-york" },
  { n: "06", label: "Travel", id: "travel" },
  { n: "07", label: "Attire", id: "attire" },
  { n: "08", label: "Questions", id: "questions" },
  { n: "09", label: "RSVP", to: "/rsvp" },
  { n: "10", label: "Registry", id: "registry" },
  { n: "11", label: "Contact", id: "contact" },
];

export const VerticalRail = () => {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.35;
      let current = "home";
      ITEMS.forEach((it) => {
        if (!it.id || it.id === "home") return;
        const el = document.getElementById(it.id);
        if (el && el.offsetTop <= y) current = it.id;
      });
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (it) => {
    if (it.id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      scrollToId(it.id);
    }
  };

  return (
    <nav
      className="hidden 2xl:flex fixed left-8 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-4"
      aria-label="Section index"
      data-testid="vertical-rail"
    >
      <button onClick={() => go({ id: "home" })} aria-label="Back to the cover" data-testid="rail-seal">
        <Seal size={58} />
      </button>
      <div className="w-px h-10 bg-[#1A1A1A]/20" />
      {ITEMS.map((it) => {
        const isActive = active === it.id;
        const inner = (
          <>
            <span
              className={`font-label text-[0.72rem] tracking-[0.1em] ${
                it.to ? "border border-[#731F17] text-[#731F17] px-2 py-1" : ""
              } ${isActive ? "text-[#731F17]" : it.to ? "" : "text-[#595959]/70"}`}
            >
              {it.n}
            </span>
            <span
              className={`font-label text-[0.6rem] tracking-[0.26em] uppercase transition-colors ${
                isActive ? "text-[#731F17]" : "text-[#595959]/70"
              }`}
            >
              {it.label}
            </span>
          </>
        );
        const cls = "flex flex-col items-center gap-1.5 group";
        return it.to ? (
          <Link key={it.n} to={it.to} className={cls} data-testid={`rail-link-rsvp`}>
            {inner}
          </Link>
        ) : (
          <button
            key={it.n}
            onClick={() => go(it)}
            className={cls}
            aria-current={isActive ? "true" : undefined}
            data-testid={`rail-link-${it.id}`}
          >
            {inner}
          </button>
        );
      })}
    </nav>
  );
};
