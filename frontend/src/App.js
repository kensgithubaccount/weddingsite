import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import "@/App.css";
import { ContentProvider } from "@/lib/content";
import PreviewGate from "@/components/PreviewGate";
import { useLenis } from "@/hooks/useLenis";
import Home from "@/pages/Home";
import RSVP from "@/pages/RSVP";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

function App() {
  useLenis();

  return (
    <div className="App">
      <div className="grain-overlay" />
      <ContentProvider>
        <PreviewGate>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/rsvp" element={<RSVP />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PreviewGate>
      </ContentProvider>
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
