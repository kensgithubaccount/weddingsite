import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, className = "", y = 24 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export const MaskedLine = ({ children, delay = 0, className = "" }) => (
  <span className={`block overflow-hidden ${className}`}>
    <motion.span
      className="block"
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

export const SectionHeading = ({ index, label, title, children, titleClass = "" }) => (
  <div className="mb-10 md:mb-14">
    <Reveal>
      <h2 className={`text-4xl sm:text-5xl lg:text-6xl tracking-tight ${titleClass || "font-display text-[#1A1A1A]"}`}>{title}</h2>
    </Reveal>
    {children && (
      <Reveal delay={0.16}>
        <div className="mt-6 max-w-2xl text-[#595959] text-base md:text-lg leading-relaxed">{children}</div>
      </Reveal>
    )}
  </div>
);
