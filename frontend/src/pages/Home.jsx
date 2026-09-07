import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { VerticalRail } from "@/components/VerticalRail";
import { AdvertisingBreak } from "@/components/AdvertisingBreak";
import { phaseConfig } from "@/lib/sitePhase";
import Hero from "@/sections/Hero";
import Invitation from "@/sections/Invitation";
import Evening from "@/sections/Evening";
import Story from "@/sections/Story";
import WeddingParty from "@/sections/WeddingParty";
import NYGuide from "@/sections/NYGuide";
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
      {s.invitation && <Invitation />}
      {phaseConfig.ads.taxi && (
        <AdvertisingBreak
          src="/ads/taxi-topper.webp"
          alt="A New York yellow cab at night with a rooftop advertisement announcing Sophie Knochenhauer and Ken Syme, June 5, 2027"
        />
      )}
      {s.evening && <Evening />}
      {s.story && <Story />}
      {s.weddingParty && <WeddingParty />}
      {s.attire && <Attire />}
      {s.questions && <FAQ />}
      {s.registry && <Registry />}
      {phaseConfig.ads.subway && (
        <AdvertisingBreak
          src="/ads/subway-campaign.webp"
          alt="A row of Sophie and Ken wedding campaign posters displayed on a New York subway platform"
          compact
        />
      )}
      {s.newYork && <NYGuide />}
      <Footer />
    </main>
  );
};

export default Home;
