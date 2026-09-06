import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { MaskedLine } from "@/components/Reveal";
import { scrollToId } from "@/hooks/useLenis";
import { useContent } from "@/lib/content";

const Hero = () => {
  const content = useContent();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section ref={ref} id="hero-cover" className="relative overflow-hidden" data-testid="hero-cover">
      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-10 md:pt-16 pb-16 md:pb-24">
        <div className="flex items-baseline justify-between rule-fine pb-3">
          <span className="overline-label">
            {content.issue.volume} · {content.issue.number} · {content.issue.edition}
          </span>
          <span className="overline-label hidden sm:block">{content.issue.price_line}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 mt-12 md:mt-16 items-start">
          <div className="lg:col-span-5 relative z-10">
            <h1 className="font-display font-semibold tracking-tight text-[#1A1A1A] text-5xl sm:text-6xl lg:text-[4.4rem] leading-[0.98]" data-testid="hero-names">
              <MaskedLine delay={0.15}>Sophie</MaskedLine>
              <MaskedLine delay={0.28}>Knochenhauer</MaskedLine>
              <MaskedLine delay={0.41} className="py-1">
                <span className="text-[#1D3F2C] font-normal italic text-4xl sm:text-5xl lg:text-6xl">&amp;</span>
              </MaskedLine>
              <MaskedLine delay={0.54}>Ken Syme</MaskedLine>
            </h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mt-8"
            >
              <p className="font-display italic text-lg md:text-xl text-[#1A1A1A]">
                We&rsquo;re getting married. Apparently, it requires a website.
              </p>
              <div className="mt-10 border-t border-[#1D3F2C]/40 pt-5" data-testid="hero-date-block">
                <p className="font-label text-[0.65rem] tracking-[0.34em] uppercase text-[#1D3F2C]">Saturday</p>
                <p className="font-std font-bold uppercase tracking-tight text-[#1D3F2C] text-4xl sm:text-5xl lg:text-[3.4rem] leading-none mt-3" data-testid="hero-date">
                  June 5, 2027
                </p>
              </div>
              <p className="font-label text-[0.68rem] tracking-[0.26em] uppercase text-[#595959] mt-6 leading-loose">
                {content.venue.name}
                <br />
                {content.venue.city}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/rsvp"
                className="font-label text-[0.72rem] tracking-[0.2em] uppercase bg-[#1D3F2C] text-[#F7F5F0] px-8 py-4 hover:bg-[#142B1F] transition-colors"
                data-testid="hero-rsvp-button"
              >
                RSVP
              </Link>
              <button
                onClick={() => scrollToId("invitation")}
                className="font-label text-[0.72rem] tracking-[0.2em] uppercase border border-[#1A1A1A]/60 px-8 py-4 hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors"
                data-testid="hero-details-button"
              >
                View the details
              </button>
            </motion.div>
          </div>

          <div className="lg:col-span-7 relative">
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative border border-[#1A1A1A]/25 bg-[#F2EFE9] p-2.5 md:p-3"
              data-testid="hero-illustration-frame"
            >
              <div className="overflow-hidden">
                <motion.img
                  src="/photos/sophie-ken-bw.jpg"
                  alt="Black-and-white photograph of Sophie and Ken laughing together, foreheads touching"
                  className="w-full h-[320px] sm:h-[420px] lg:h-[520px] object-cover"
                  style={{ y: imgY, scale: 1.12 }}
                  data-testid="hero-illustration"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
