import { Link } from "react-router-dom";
import { Seal } from "@/components/Seal";

const NotFound = () => (
  <main className="min-h-screen bg-[#F7F5F0] flex items-center justify-center px-6" data-testid="not-found-page">
    <div className="text-center max-w-xl">
      <img
        src="/illustrations/checker-taxi.png"
        alt=""
        className="w-56 sm:w-64 mx-auto select-none"
        data-testid="not-found-illustration"
      />
      <h1 className="font-display text-4xl sm:text-5xl tracking-tight mt-10 text-[#1A1A1A]" data-testid="not-found-headline">
        This does not appear to be the place.
      </h1>
      <p className="font-body italic text-[#595959] mt-4">
        The page you were looking for has either moved, was never invited, or got into the wrong cab.
      </p>
      <Link
        to="/"
        className="inline-block mt-10 font-label text-[0.7rem] tracking-[0.18em] uppercase bg-[#731F17] text-[#F7F5F0] px-8 py-4 hover:bg-[#5d1812] transition-colors"
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
