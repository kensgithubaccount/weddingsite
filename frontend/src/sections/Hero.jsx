import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { MaskedLine } from "@/components/Reveal";
import { DateStamp, EditionStamp } from "@/components/Seal";
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
                <span className="text-[#731F17] font-normal italic text-4xl sm:text-5xl lg:text-6xl">&amp;</span>
              </MaskedLine>
              <MaskedLine delay={0.54}>Ken Syme</MaskedLine>
            </h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mt-8"
            >
              <p className="font-display italic text-xl md:text-2xl text-[#1A1A1A]">
                We&rsquo;re getting married.
              </p>
              <p className="font-display text-2xl md:text-[1.7rem] mt-4 text-[#1A1A1A]">{content.date.display}</p>
              <p className="font-body text-[#595959] mt-2 leading-relaxed">
                {content.venue.name}
                <br />
                {content.venue.city}
              </p>
              <p className="font-body italic text-[#595959] mt-6 text-[0.95rem]">{content.couple.tagline}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/rsvp"
                className="font-label text-[0.72rem] tracking-[0.2em] uppercase bg-[#731F17] text-[#F7F5F0] px-8 py-4 hover:bg-[#5d1812] transition-colors"
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="mt-12 hidden lg:block"
            >
              <EditionStamp text="ONE NIGHT ONLY" />
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
                  src="/illustrations/hero.png"
                  alt="Editorial ink-and-wash illustration of Sophie and Ken crossing Central Park South toward the New York Athletic Club, the city quietly rearranging itself around them"
                  className="w-full h-[320px] sm:h-[420px] lg:h-[520px] object-cover"
                  style={{ y: imgY, scale: 1.12 }}
                  data-testid="hero-illustration"
                />
              </div>
              <p className="font-label text-[0.6rem] tracking-[0.18em] uppercase text-[#595959] pt-2.5 px-1 flex justify-between">
                <span>Central Park South, shortly before everything changes</span>
                <span className="hidden sm:inline">Fig. 1</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 1.35, rotate: -14 }}
              animate={{ opacity: 1, scale: 1, rotate: -10 }}
              transition={{ duration: 0.7, delay: 1.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-6 -left-2 sm:-left-6 bg-[#F7F5F0]/90"
            >
              <DateStamp text={content.date.stamp} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
