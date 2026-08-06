import { Link } from "react-router-dom";
import { Seal } from "@/components/Seal";

const NotFound = () => (
  <main className="min-h-screen bg-[#F7F5F0] flex items-center justify-center px-6" data-testid="not-found-page">
    <div className="text-center max-w-lg">
      <figure className="border border-[#1A1A1A]/25 bg-[#F2EFE9] p-2.5 max-w-sm mx-auto">
        <img
          src="/illustrations/pigeon.png"
          alt="Ink-and-wash illustration of a city pigeon standing with unusual dignity on a marble step"
          className="w-full h-64 object-cover"
          data-testid="not-found-illustration"
        />
        <figcaption className="font-label text-[0.6rem] tracking-[0.16em] uppercase text-[#595959] pt-2.5 px-1">
          Our correspondent at the scene
        </figcaption>
      </figure>
      <h1 className="font-display text-4xl sm:text-5xl tracking-tight mt-10 text-[#1A1A1A]" data-testid="not-found-headline">
        This does not appear to be on the itinerary.
      </h1>
      <p className="font-body italic text-[#595959] mt-4">
        The page you were looking for has stepped out for a moment.
      </p>
      <Link
        to="/"
        className="inline-block mt-10 font-label text-[0.7rem] tracking-[0.18em] uppercase bg-[#731F17] text-[#F7F5F0] px-8 py-4 hover:bg-[#5d1812] transition-colors"
        data-testid="not-found-home-button"
      >
        Back to the cover
      </Link>
      <div className="mt-12 flex justify-center">
        <Seal size={56} />
      </div>
    </div>
  </main>
);

export default NotFound;
