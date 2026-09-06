import { Link } from "react-router-dom";
import { Seal } from "@/components/Seal";
import { Pigeon } from "@/components/LineArt";

const NotFound = () => (
  <main className="min-h-screen bg-[#F7F5F0] flex items-center justify-center px-6" data-testid="not-found-page">
    <div className="text-center max-w-xl">
      <figure className="max-w-lg mx-auto">
        <Pigeon className="w-24 mx-auto -rotate-3" testId="not-found-illustration" />
        <figcaption className="font-label text-[0.6rem] tracking-[0.16em] uppercase text-[#595959] pt-4">
          Not the New York Athletic Club
        </figcaption>
      </figure>
      <h1 className="font-display text-4xl sm:text-5xl tracking-tight mt-10 text-[#1A1A1A]" data-testid="not-found-headline">
        This does not appear to be the place.
      </h1>
      <p className="font-body italic text-[#595959] mt-4">
        The page you were looking for has either moved or was never invited.
      </p>
      <Link
        to="/"
        className="inline-block mt-10 font-label text-[0.7rem] tracking-[0.18em] uppercase bg-[#1D3F2C] text-[#F7F5F0] px-8 py-4 hover:bg-[#142B1F] transition-colors"
        data-testid="not-found-home-button"
      >
        Back to the wedding
      </Link>
      <div className="mt-12 flex justify-center">
        <Seal size={56} />
      </div>
    </div>
  </main>
);

export default NotFound;
