import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { phaseConfig } from "@/lib/sitePhase";
import RSVP from "@/pages/RSVP";
import NotFound from "@/pages/NotFound";

const RSVPRoute = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [tokenState, setTokenState] = useState(token ? "checking" : "missing");

  useEffect(() => {
    if (phaseConfig.rsvpEnabled || !token) return;

    let active = true;
    setTokenState("checking");

    api
      .get(`/rsvp/update/${encodeURIComponent(token)}`)
      .then(() => {
        if (active) setTokenState("valid");
      })
      .catch(() => {
        if (active) setTokenState("invalid");
      });

    return () => {
      active = false;
    };
  }, [token]);

  if (phaseConfig.rsvpEnabled) return <RSVP />;
  if (!token || tokenState === "invalid" || tokenState === "missing") return <NotFound />;

  if (tokenState === "checking") {
    return (
      <main className="min-h-screen bg-[#F7F5F0] flex items-center justify-center px-5">
        <p className="font-label text-[0.72rem] tracking-[0.2em] uppercase text-[#595959]">
          Checking your RSVP link…
        </p>
      </main>
    );
  }

  return <RSVP />;
};

export default RSVPRoute;
