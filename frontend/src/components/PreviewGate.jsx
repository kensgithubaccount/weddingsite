import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Seal } from "@/components/Seal";

const KEY = "sk_preview_unlocked";

export const isUnlocked = () => localStorage.getItem(KEY) === "1";

const PreviewGate = ({ children }) => {
  const [unlocked, setUnlocked] = useState(isUnlocked());
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/preview/unlock", { password });
      localStorage.setItem(KEY, "1");
      setUnlocked(true);
    } catch {
      toast.error("That isn't the word on the door.");
    } finally {
      setLoading(false);
    }
  };

  if (unlocked) return children;

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center px-6" data-testid="preview-gate">
      <div className="grain-overlay" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md text-center"
      >
        <Seal size={88} className="mx-auto" />
        <p className="overline-label mt-8">Advance Copy · Not for General Circulation</p>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight mt-4 text-[#1A1A1A]">
          Sophie <span className="text-[#1D3F2C]">&amp;</span> Ken
        </h1>
        <p className="font-body text-[#595959] mt-4 text-sm leading-relaxed">
          This issue is still at the printers. If you're expected, you know the word.
        </p>
        <form onSubmit={submit} className="mt-8">
          <label htmlFor="preview-password" className="overline-label block text-left mb-2">
            Password
          </label>
          <input
            id="preview-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b-2 border-[#1A1A1A]/25 focus:border-[#1D3F2C] outline-none py-3 font-body text-lg text-[#1A1A1A] transition-colors"
            autoComplete="off"
            data-testid="preview-password-input"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full font-label text-[0.7rem] tracking-[0.22em] uppercase bg-[#1A1A1A] text-[#F7F5F0] py-4 hover:bg-[#1D3F2C] transition-colors disabled:opacity-60"
            data-testid="preview-unlock-button"
          >
            {loading ? "Checking the list…" : "Enter"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default PreviewGate;
