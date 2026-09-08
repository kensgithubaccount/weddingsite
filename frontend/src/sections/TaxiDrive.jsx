import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const TaxiDrive = () => {
  const taxiTrackRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: taxiTrackRef,
    offset: ["start end", "end start"],
  });
  const taxiX = useTransform(scrollYProgress, [0, 1], ["-85vw", "105vw"]);

  return (
    <section className="py-2 md:py-4" aria-label="Wedding taxi artwork" data-testid="taxi-drive-section">
      <div
        ref={taxiTrackRef}
        className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-2 md:py-4"
        data-testid="details-taxi-track"
      >
        <motion.div style={{ x: taxiX }} className="w-max will-change-transform">
          <img
            src="/art/vintage_nyc_taxi_with_trailing_cans.png"
            alt=""
            aria-hidden="true"
            className="block w-[78vw] sm:w-[68vw] lg:w-[760px] h-auto object-contain"
            data-testid="details-save-date-cab"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default TaxiDrive;
