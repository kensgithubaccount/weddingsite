import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Marquee } from "@/components/Marquee";
import Hero from "@/sections/Hero";
import Invitation from "@/sections/Invitation";
import Evening from "@/sections/Evening";
import Story from "@/sections/Story";
import NYGuide from "@/sections/NYGuide";
import Travel from "@/sections/Travel";
import Attire from "@/sections/Attire";
import FAQ from "@/sections/FAQ";
import Registry from "@/sections/Registry";
import Contact from "@/sections/Contact";

const Home = () => (
  <main data-testid="home-page">
    <Nav />
    <Hero />
    <Marquee />
    <Invitation />
    <Evening />
    <Story />
    <NYGuide />
    <Travel />
    <Attire />
    <FAQ />
    <Registry />
    <Contact />
    <Footer />
  </main>
);

export default Home;
