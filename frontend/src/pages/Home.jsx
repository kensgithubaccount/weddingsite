import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { VerticalRail } from "@/components/VerticalRail";
import { AdvertisingBreak } from "@/components/AdvertisingBreak";
import { phaseConfig } from "@/lib/sitePhase";
import Hero from "@/sections/Hero";
import Evening from "@/sections/Evening";
import Story from "@/sections/Story";
import Hotel from "@/sections/Hotel";
import WeddingParty from "@/sections/WeddingParty";
import Attire from "@/sections/Attire";
import FAQ from "@/sections/FAQ";
import Registry from "@/sections/Registry";

const Home = () => {
  const s = phaseConfig.sections;

  return (
    <main data-testid="home-page" className="xl:pl-28">
      <Nav />
      <VerticalRail />
      <Hero />
      {s.evening && <Evening />}
      {s.story && <Story />}
      {s.hotel && <Hotel />}
      {s.weddingParty && <WeddingParty />}
      {s.attire && <Attire />}
      {s.questions && <FAQ />}
      {s.registry && <Registry />}
      {phaseConfig.ads.subway && <AdvertisingBreak variant="subway" />}
      <Footer />
    </main>
  );
};

export default Home;
