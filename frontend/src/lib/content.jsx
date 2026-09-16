import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      try {
        const res = await api.get("/content");
        if (active) setContent(res.data);
        return;
      } catch {
        // Persistent static deployments (for example GitHub Pages) do not
        // have the FastAPI preview endpoint. Fall back to the content snapshot
        // generated from backend/content.py during the deployment build.
      }

      try {
        const base = (process.env.PUBLIC_URL || "").replace(/\/$/, "");
        const res = await fetch(`${base}/content.json`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Static content request failed: ${res.status}`);
        const data = await res.json();
        if (active) setContent(data);
      } catch {
        if (active) setError(true);
      }
    };

    loadContent();

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0] px-6">
        <p className="font-display text-2xl text-[#1A1A1A] text-center">
          The presses have stopped for a moment. Please refresh.
        </p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0]" data-testid="content-loading">
        <p className="overline-label animate-pulse">Sophie + Ken — June 5, 2027</p>
      </div>
    );
  }

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
};

export const useContent = () => useContext(ContentContext);
