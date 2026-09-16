import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import "@/App.css";
import "@/interactions.css";
import { ContentProvider } from "@/lib/content";
import { useLenis } from "@/hooks/useLenis";
import { PhasePreviewToggle } from "@/components/PhasePreviewToggle";
import RSVPRoute from "@/components/RSVPRoute";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.25 });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#1D3F2C] origin-left z-[100] xl:hidden"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />
      <motion.div
        className="hidden xl:block fixed left-0 top-0 bottom-0 w-[2px] bg-[#1D3F2C] origin-top z-[100]"
        style={{ scaleY: progress }}
        aria-hidden="true"
      />
    </>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/rsvp" element={<RSVPRoute />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  useLenis();

  return (
    <div className="App">
      <div className="grain-overlay" />
      <MotionConfig reducedMotion="user">
        <ContentProvider>
          <BrowserRouter basename={process.env.PUBLIC_URL || undefined}>
            <ScrollProgress />
            <AnimatedRoutes />
            <PhasePreviewToggle />
          </BrowserRouter>
        </ContentProvider>
      </MotionConfig>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#F7F5F0",
            color: "#1A1A1A",
            border: "1px solid rgba(26,26,26,0.25)",
            borderRadius: "2px",
            fontFamily: "'Lora', Georgia, serif",
          },
        }}
      />
    </div>
  );
}

export default App;
