import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useContent } from "@/lib/content";
import { DateStamp, Seal } from "@/components/Seal";

const inputCls =
  "w-full bg-transparent border-b-2 border-[#1A1A1A]/25 focus:border-[#731F17] outline-none py-3 font-body text-base text-[#1A1A1A] transition-colors placeholder:text-[#595959]/50";
const labelCls = "overline-label block mb-1.5";

const StepShell = ({ children, stepKey }) => (
  <motion.div
    key={stepKey}
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const RSVP = () => {
  const content = useContent();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lookup, setLookup] = useState({ first_name: "", last_name: "", company: "" });
  const [household, setHousehold] = useState(null);
  const [responses, setResponses] = useState({});
  const [contact, setContact] = useState({ email: "", phone: "", note: "", personality_answer: "", company: "" });
  const [result, setResult] = useState(null);

  const doLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/rsvp/lookup", lookup);
      setHousehold(res.data);
      const initial = {};
      res.data.members.forEach((m) => {
        const prev = res.data.existing?.responses?.find((r) => r.guest_id === m.id);
        initial[m.id] = {
          attending: prev ? prev.attending : true,
          meal: prev?.meal || "",
          dietary: prev?.dietary || "",
          accessibility: prev?.accessibility || "",
          plus_one_name: prev?.plus_one_name || "",
        };
      });
      setResponses(initial);
      if (res.data.existing) {
        setContact((c) => ({
          ...c,
          email: res.data.existing.email || "",
          phone: res.data.existing.phone || "",
          note: res.data.existing.note || "",
          personality_answer: res.data.existing.personality_answer || "",
        }));
        toast.info("Welcome back — your previous response is loaded below.");
      }
      setStep(1);
    } catch (err) {
      toast.error(err.response?.data?.detail || "We couldn't find that invitation.");
    } finally {
      setLoading(false);
    }
  };

  const doSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        household_id: household.household.id,
        email: contact.email,
        phone: contact.phone,
        note: contact.note,
        personality_answer: contact.personality_answer,
        company: contact.company,
        responses: household.members.map((m) => ({ guest_id: m.id, ...responses[m.id] })),
      };
      const res = await api.post("/rsvp/submit", payload);
      setResult(res.data);
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const attendingCount = result?.responses?.filter((r) => r.attending).length || 0;

  return (
    <main className="min-h-screen bg-[#F7F5F0]" data-testid="rsvp-page">
      <header className="border-b border-[#1A1A1A]/15">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" data-testid="rsvp-home-link">
            <Seal size={32} />
            <span className="font-display font-semibold text-lg">Sophie + Ken</span>
          </Link>
          <span className="overline-label">RSVP Desk</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-16 md:py-24">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepShell stepKey="lookup">
              <p className="overline-label text-[#731F17]">Step one</p>
              <h1 className="font-display text-4xl sm:text-5xl tracking-tight mt-4 text-[#1A1A1A]" data-testid="rsvp-lookup-title">
                Let&rsquo;s find your invitation
              </h1>
              <p className="font-body text-[#595959] mt-4 text-[0.95rem]">
                Your name as it appears on the envelope.
              </p>
              <form onSubmit={doLookup} className="mt-10 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="rsvp-first" className={labelCls}>First name</label>
                    <input
                      id="rsvp-first"
                      required
                      value={lookup.first_name}
                      onChange={(e) => setLookup({ ...lookup, first_name: e.target.value })}
                      className={inputCls}
                      data-testid="rsvp-first-name-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="rsvp-last" className={labelCls}>Last name</label>
                    <input
                      id="rsvp-last"
                      required
                      value={lookup.last_name}
                      onChange={(e) => setLookup({ ...lookup, last_name: e.target.value })}
                      className={inputCls}
                      data-testid="rsvp-last-name-input"
                    />
                  </div>
                </div>
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                  value={lookup.company}
                  onChange={(e) => setLookup({ ...lookup, company: e.target.value })}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto font-label text-[0.72rem] tracking-[0.2em] uppercase bg-[#731F17] text-[#F7F5F0] px-10 py-4 hover:bg-[#5d1812] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  data-testid="rsvp-lookup-submit"
                >
                  {loading ? "Checking the list…" : "Find my invitation"} <ArrowRight size={14} />
                </button>
              </form>
            </StepShell>
          )}

          {step === 1 && household && (
            <StepShell stepKey="responses">
              <p className="overline-label text-[#731F17]">Step two — {household.household.name}</p>
              <h1 className="font-display text-4xl sm:text-5xl tracking-tight mt-4 text-[#1A1A1A]" data-testid="rsvp-responses-title">
                Who&rsquo;s coming?
              </h1>
              <div className="mt-10 space-y-10">
                {household.members.map((m) => {
                  const r = responses[m.id];
                  return (
                    <div key={m.id} className="rule-fine pt-6" data-testid={`rsvp-guest-${m.id}`}>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <p className="font-display text-2xl tracking-tight text-[#1A1A1A]">
                          {m.first_name} {m.last_name}
                        </p>
                        <div className="flex gap-2" role="group" aria-label={`Attendance for ${m.first_name} ${m.last_name}`}>
                          <button
                            onClick={() => setResponses({ ...responses, [m.id]: { ...r, attending: true } })}
                            aria-pressed={r.attending}
                            className={`font-label text-[0.65rem] tracking-[0.16em] uppercase px-5 py-2.5 border transition-colors ${
                              r.attending ? "bg-[#4A5D4E] text-[#F7F5F0] border-[#4A5D4E]" : "border-[#1A1A1A]/40 hover:border-[#1A1A1A]"
                            }`}
                            data-testid={`rsvp-attending-yes-${m.id}`}
                          >
                            Joyfully attends
                          </button>
                          <button
                            onClick={() => setResponses({ ...responses, [m.id]: { ...r, attending: false } })}
                            aria-pressed={!r.attending}
                            className={`font-label text-[0.65rem] tracking-[0.16em] uppercase px-5 py-2.5 border transition-colors ${
                              !r.attending ? "bg-[#731F17] text-[#F7F5F0] border-[#731F17]" : "border-[#1A1A1A]/40 hover:border-[#1A1A1A]"
                            }`}
                            data-testid={`rsvp-attending-no-${m.id}`}
                          >
                            Regretfully declines
                          </button>
                        </div>
                      </div>

                      {r.attending && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                          {content.meal_options.enabled && (
                            <div>
                              <label htmlFor={`meal-${m.id}`} className={labelCls}>Entrée</label>
                              <select
                                id={`meal-${m.id}`}
                                value={r.meal}
                                onChange={(e) => setResponses({ ...responses, [m.id]: { ...r, meal: e.target.value } })}
                                className={`${inputCls} cursor-pointer`}
                                data-testid={`rsvp-meal-${m.id}`}
                              >
                                <option value="">Choose an entrée</option>
                                {content.meal_options.options.map((o) => (
                                  <option key={o} value={o}>{o}</option>
                                ))}
                              </select>
                              {content.meal_options.sample && (
                                <p className="font-body italic text-[#595959]/70 text-xs mt-1.5">{content.meal_options.sample_note}</p>
                              )}
                            </div>
                          )}
                          <div>
                            <label htmlFor={`dietary-${m.id}`} className={labelCls}>Dietary restrictions</label>
                            <input
                              id={`dietary-${m.id}`}
                              value={r.dietary}
                              onChange={(e) => setResponses({ ...responses, [m.id]: { ...r, dietary: e.target.value } })}
                              className={inputCls}
                              placeholder="None, we hope"
                              data-testid={`rsvp-dietary-${m.id}`}
                            />
                          </div>
                          <div>
                            <label htmlFor={`access-${m.id}`} className={labelCls}>Accessibility needs</label>
                            <input
                              id={`access-${m.id}`}
                              value={r.accessibility}
                              onChange={(e) => setResponses({ ...responses, [m.id]: { ...r, accessibility: e.target.value } })}
                              className={inputCls}
                              placeholder="Anything we should know"
                              data-testid={`rsvp-accessibility-${m.id}`}
                            />
                          </div>
                          {m.plus_one_allowed && (
                            <div>
                              <label htmlFor={`plusone-${m.id}`} className={labelCls}>Plus-one&rsquo;s name (optional)</label>
                              <input
                                id={`plusone-${m.id}`}
                                value={r.plus_one_name}
                                onChange={(e) => setResponses({ ...responses, [m.id]: { ...r, plus_one_name: e.target.value } })}
                                className={inputCls}
                                placeholder="Your invitation includes a guest"
                                data-testid={`rsvp-plusone-${m.id}`}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-12 flex flex-wrap gap-4">
                <button
                  onClick={() => setStep(0)}
                  className="font-label text-[0.7rem] tracking-[0.18em] uppercase border border-[#1A1A1A]/50 px-8 py-4 hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors flex items-center gap-2"
                  data-testid="rsvp-back-button"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="font-label text-[0.7rem] tracking-[0.18em] uppercase bg-[#731F17] text-[#F7F5F0] px-8 py-4 hover:bg-[#5d1812] transition-colors flex items-center gap-2"
                  data-testid="rsvp-continue-button"
                >
                  Continue <ArrowRight size={14} />
                </button>
              </div>
            </StepShell>
          )}

          {step === 2 && (
            <StepShell stepKey="contact">
              <p className="overline-label text-[#731F17]">Step three — nearly there</p>
              <h1 className="font-display text-4xl sm:text-5xl tracking-tight mt-4 text-[#1A1A1A]" data-testid="rsvp-contact-title">
                Where do we send word?
              </h1>
              <form onSubmit={doSubmit} className="mt-10 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="rsvp-email" className={labelCls}>Email</label>
                    <input
                      id="rsvp-email"
                      type="email"
                      required
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      className={inputCls}
                      data-testid="rsvp-email-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="rsvp-phone" className={labelCls}>Phone (optional)</label>
                    <input
                      id="rsvp-phone"
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      className={inputCls}
                      data-testid="rsvp-phone-input"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="rsvp-song" className={labelCls}>{content.rsvp.personality_question}</label>
                  <input
                    id="rsvp-song"
                    value={contact.personality_answer}
                    onChange={(e) => setContact({ ...contact, personality_answer: e.target.value })}
                    className={inputCls}
                    data-testid="rsvp-song-input"
                  />
                </div>
                <div>
                  <label htmlFor="rsvp-note" className={labelCls}>A note for the couple (optional)</label>
                  <textarea
                    id="rsvp-note"
                    rows={3}
                    value={contact.note}
                    onChange={(e) => setContact({ ...contact, note: e.target.value })}
                    className={`${inputCls} resize-none`}
                    data-testid="rsvp-note-input"
                  />
                </div>
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                  value={contact.company}
                  onChange={(e) => setContact({ ...contact, company: e.target.value })}
                />
                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="font-label text-[0.7rem] tracking-[0.18em] uppercase border border-[#1A1A1A]/50 px-8 py-4 hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors flex items-center gap-2"
                    data-testid="rsvp-contact-back-button"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="font-label text-[0.7rem] tracking-[0.18em] uppercase bg-[#731F17] text-[#F7F5F0] px-8 py-4 hover:bg-[#5d1812] transition-colors disabled:opacity-60"
                    data-testid="rsvp-submit-button"
                  >
                    {loading ? "Sealing the envelope…" : "Send response"}
                  </button>
                </div>
              </form>
            </StepShell>
          )}

          {step === 3 && result && (
            <StepShell stepKey="confirmation">
              <div className="text-center py-10" data-testid="rsvp-confirmation">
                <Seal size={80} className="mx-auto" />
                {result.attending_any ? (
                  <>
                    <h1 className="font-display text-5xl sm:text-6xl tracking-tight mt-10 text-[#731F17]" data-testid="rsvp-confirmation-headline">
                      You&rsquo;re on the list.
                    </h1>
                    <p className="font-body italic text-[#595959] mt-5 text-lg">
                      We&rsquo;ll see you in New York on June 5.
                    </p>
                    <div className="mt-10 stamp-land inline-block">
                      <DateStamp text={content.date.stamp} />
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="font-display text-5xl sm:text-6xl tracking-tight mt-10 text-[#1A1A1A]" data-testid="rsvp-confirmation-headline">
                      We&rsquo;ll miss you.
                    </h1>
                    <p className="font-body italic text-[#595959] mt-5 text-lg max-w-md mx-auto leading-relaxed">
                      Thank you for letting us know. We&rsquo;re lucky to have you in our lives, wherever you are that night.
                    </p>
                  </>
                )}
                <p className="font-label text-[0.65rem] tracking-[0.18em] uppercase text-[#595959] mt-10" data-testid="rsvp-confirmation-email-note">
                  {result.email_sent
                    ? "A confirmation is on its way to your inbox"
                    : "Your response is recorded — the confirmation email is still finding its way"}
                </p>
                <p className="font-body text-sm text-[#595959] mt-6">
                  {attendingCount > 0 && `${attendingCount} attending · `}Plans change? Come back any time and revise — your response will be waiting.
                </p>
                <Link
                  to="/"
                  className="inline-block mt-10 font-label text-[0.7rem] tracking-[0.18em] uppercase border border-[#1A1A1A]/60 px-8 py-4 hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors"
                  data-testid="rsvp-confirmation-home-button"
                >
                  Back to the issue
                </Link>
              </div>
            </StepShell>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default RSVP;
