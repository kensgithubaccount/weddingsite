import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get("/content")
      .then((res) => setContent(res.data))
      .catch(() => setError(true));
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
