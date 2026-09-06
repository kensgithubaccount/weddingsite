import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarPlus, Download } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useContent } from "@/lib/content";
import { DateStamp, Seal } from "@/components/Seal";

const inputCls =
  "w-full bg-transparent border-b-2 border-[#1A1A1A]/25 focus:border-[#731F17] outline-none py-3 font-body text-base text-[#1A1A1A] transition-colors placeholder:text-[#595959]/50";
const labelCls = "overline-label block mb-1.5";
const primaryBtn =
  "font-label text-[0.72rem] tracking-[0.2em] uppercase bg-[#731F17] text-[#F7F5F0] px-10 py-4 hover:bg-[#5d1812] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 min-h-[44px]";
const secondaryBtn =
  "font-label text-[0.7rem] tracking-[0.18em] uppercase border border-[#1A1A1A]/50 px-8 py-4 hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors flex items-center justify-center gap-2 min-h-[44px]";

const STEP_BASE = { lookup: 1, party: 1, returning: 1, attendance: 2 };

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

const CAL = {
  title: "Sophie Knochenhauer & Ken Syme Wedding",
  startUtc: "20270605T213000Z",
  endUtc: "20270606T033000Z",
  location: "New York Athletic Club, 180 Central Park South, New York, New York",
  details: "Ceremony 6:00 PM, reception to follow. Black tie optional.",
};

const googleCalUrl = () =>
  `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(CAL.title)}&dates=${CAL.startUtc}/${CAL.endUtc}&location=${encodeURIComponent(CAL.location)}&details=${encodeURIComponent(CAL.details)}`;

const outlookCalUrl = () =>
  `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(CAL.title)}&startdt=2027-06-05T21:30:00Z&enddt=2027-06-06T03:30:00Z&location=${encodeURIComponent(CAL.location)}&body=${encodeURIComponent(CAL.details)}`;

const downloadIcs = () => {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sophie + Ken//Wedding//EN",
    "BEGIN:VEVENT",
    "UID:sophie-ken-2027@sophieandken",
    "DTSTAMP:20260701T120000Z",
    `DTSTART:${CAL.startUtc}`,
    `DTEND:${CAL.endUtc}`,
    `SUMMARY:${CAL.title}`,
    `LOCATION:${CAL.location.replace(/,/g, "\\,")}`,
    `DESCRIPTION:${CAL.details}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sophie-and-ken-june-5-2027.ics";
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Saved to your calendar — June 5, 2027.");
};

const RSVP = () => {
  const content = useContent();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState(null);
  const [step, setStep] = useState("lookup");
  const [busy, setBusy] = useState(false);
  const [lookupState, setLookupState] = useState("idle"); // idle | loading | not_found | error
  const [name, setName] = useState("");
  const [multiple, setMultiple] = useState(null); // { method, candidates_token }
  const [disambiguator, setDisambiguator] = useState("");
  const [token, setToken] = useState("");
  const [party, setParty] = useState(null);
  const [members, setMembers] = useState([]);
  const [existing, setExisting] = useState(null);
  const [responses, setResponses] = useState({});
  const [eventResponses, setEventResponses] = useState({});
  const [details, setDetails] = useState({ accessibility_notes: "", song_request: "", message_to_couple: "" });
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [announce, setAnnounce] = useState("");
  const [t0] = useState(Date.now());
  const headingRef = useRef(null);

  useEffect(() => {
    api.get("/rsvp/status").then((r) => setStatus(r.data)).catch(() => setStatus({ closed: false }));
  }, []);

  // Signed update link: /rsvp?token=…
  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (!urlToken) return;
    setBusy(true);
    api
      .get(`/rsvp/update/${urlToken}`)
      .then((r) => {
        applyFound(r.data);
        setStep("returning");
        setAnnounce("Welcome back. We already have a response for your party.");
      })
      .catch((err) => {
        toast.error(err.response?.data?.detail || "That link has expired. Please look up your invitation again.");
      })
      .finally(() => setBusy(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const applyFound = (data) => {
    setToken(data.token);
    setParty(data.party);
    setMembers(data.members);
    setExisting(data.existing);
    const initial = {};
    data.members.forEach((m) => {
      const prev = data.existing?.responses?.find((r) => r.guest_id === m.id);
      initial[m.id] = {
        attending: prev ? prev.attending : null,
        meal_choice: prev?.meal_choice || "",
        dietary_notes: prev?.dietary_notes || "",
        plus_one_name: prev?.plus_one_name || "",
      };
    });
    setResponses(initial);
    const initialEvents = {};
    (data.existing?.event_responses || []).forEach((er) => {
      initialEvents[`${er.guest_id}:${er.event_code}`] = er.attending;
    });
    setEventResponses(initialEvents);
    if (data.existing) {
      setEmail(data.existing.email || "");
      setDetails({
        accessibility_notes: data.existing.accessibility_notes || "",
        song_request: data.existing.song_request || "",
        message_to_couple: data.existing.message_to_couple || "",
      });
    }
  };

  const doLookup = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setLookupState("loading");
    setMultiple(null);
    setAnnounce("Checking the list.");
    try {
      const res = await api.post("/guest-lookup", { name, t: t0, company: "" });
      const d = res.data;
      if (d.status === "found") {
        applyFound(d);
        setLookupState("idle");
        setStep(d.already_responded ? "returning" : "party");
        setAnnounce(d.already_responded ? "Welcome back. We already have a response for your party." : "We found your invitation.");
      } else if (d.status === "multiple") {
        setMultiple({ method: d.method, candidates_token: d.candidates_token });
        setLookupState("idle");
        setAnnounce("More than one party matches that name. One more detail, please.");
      } else {
        setLookupState("not_found");
        setAnnounce("We couldn't find that name.");
      }
    } catch (err) {
      setLookupState("error");
      setAnnounce("Something went wrong. Please try again.");
      toast.error(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const doDisambiguate = async (e) => {
    e.preventDefault();
    if (!disambiguator.trim()) return;
    setBusy(true);
    setLookupState("loading");
    try {
      const res = await api.post("/guest-lookup", {
        name,
        disambiguator,
        candidates_token: multiple.candidates_token,
        t: t0,
        company: "",
      });
      const d = res.data;
      if (d.status === "found") {
        applyFound(d);
        setLookupState("idle");
        setStep(d.already_responded ? "returning" : "party");
      } else {
        setLookupState("not_found");
        setMultiple(null);
      }
    } catch {
      setLookupState("error");
    } finally {
      setBusy(false);
    }
  };

  const resetToLookup = () => {
    setStep("lookup");
    setParty(null);
    setMembers([]);
    setExisting(null);
    setToken("");
    setMultiple(null);
    setLookupState("idle");
    setName("");
    setDisambiguator("");
  };

  const attendingCount = members.filter((m) => responses[m.id]?.attending).length;
  const allAnswered = members.length > 0 && members.every((m) => responses[m.id]?.attending !== null && responses[m.id]?.attending !== undefined);

  // Secondary events (e.g. rehearsal dinner): only members holding an invitation
  // receive an `events` array from the server — everyone else never sees it.
  const eventMembers = members.filter((m) => (m.events || []).length > 0);
  const hasEvents = eventMembers.length > 0;
  const allEventsAnswered = eventMembers.every((m) =>
    m.events.every((ev) => eventResponses[`${m.id}:${ev.code}`] !== undefined && eventResponses[`${m.id}:${ev.code}`] !== null)
  );

  const stepNumbers = hasEvents
    ? { ...STEP_BASE, events: 3, details: 4, contact: 5, review: 6 }
    : { ...STEP_BASE, details: 3, contact: 4, review: 5 };
  const totalSteps = hasEvents ? 6 : 5;
  const afterAttendance = hasEvents ? "events" : "details";

  const doSubmit = async () => {
    setBusy(true);
    setAnnounce("Sealing the envelope.");
    try {
      const res = await api.post("/rsvp/submit", {
        token,
        email,
        responses: members.map((m) => ({ guest_id: m.id, ...responses[m.id] })),
        event_responses: eventMembers.flatMap((m) =>
          m.events.map((ev) => ({
            guest_id: m.id,
            event_code: ev.code,
            attending: eventResponses[`${m.id}:${ev.code}`] === true,
          }))
        ),
        ...details,
        t: t0,
        company: "",
      });
      setResult(res.data);
      setStep("done");
      setAnnounce(res.data.attending_any ? "You're in. We'll see you in New York on June 5." : "We'll miss you.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const mealEnabled = status?.meal_options_enabled && status?.meal_options?.length > 0;

  const StepIndicator = () => (
    <p className="font-label text-[0.62rem] tracking-[0.22em] uppercase text-[#595959]/70" data-testid="rsvp-step-indicator">
      {String(stepNumbers[step] || 1).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
    </p>
  );

  if (status?.closed) {
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
        <div className="max-w-3xl mx-auto px-5 py-24 text-center" data-testid="rsvp-closed">
          <Seal size={72} className="mx-auto" />
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight mt-8 text-[#1A1A1A]">RSVPs are now closed.</h1>
          <p className="font-body italic text-[#595959] mt-5 text-lg">
            If your plans have changed, please contact us directly.
          </p>
          <Link to="/" className={`${secondaryBtn} inline-flex mt-10`} data-testid="rsvp-closed-home-button">
            Back to the wedding
          </Link>
        </div>
      </main>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen bg-[#F7F5F0]" data-testid="rsvp-page">
        <div className="sr-only" role="status" aria-live="polite" data-testid="rsvp-aria-status">
          {announce}
        </div>
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
          {step !== "done" && (
            <div className="flex items-baseline justify-between rule-fine pb-3 mb-12">
              <span className="overline-label text-[#731F17]">09 — RSVP</span>
              <StepIndicator />
            </div>
          )}
          <AnimatePresence mode="wait">
            {step === "lookup" && (
              <StepShell stepKey="lookup">
                <h1
                  ref={headingRef}
                  tabIndex={-1}
                  className="font-display text-4xl sm:text-5xl tracking-tight text-[#1A1A1A] outline-none"
                  data-testid="rsvp-lookup-title"
                >
                  Let&rsquo;s find your invitation
                </h1>
                <p className="font-body text-[#595959] mt-4 text-[0.95rem]">
                  Enter your name exactly as it appears on your invitation.
                </p>
                <p className="font-body italic text-[#595959] mt-2 text-[0.95rem]" data-testid="rsvp-deadline-note">
                  {content.rsvp.deadline_note}
                </p>

                <form onSubmit={doLookup} className="mt-10 space-y-8">
                  <div>
                    <label htmlFor="rsvp-name" className={labelCls}>First and last name</label>
                    <input
                      id="rsvp-name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputCls}
                      autoComplete="name"
                      data-testid="rsvp-name-input"
                    />
                  </div>
                  <button type="submit" disabled={busy} className={`w-full sm:w-auto ${primaryBtn}`} data-testid="rsvp-lookup-submit">
                    {lookupState === "loading" ? "Checking the list…" : "Find my invitation"} <ArrowRight size={14} />
                  </button>
                </form>

                {lookupState === "not_found" && (
                  <div className="rule-fine mt-10 pt-6" role="alert" data-testid="rsvp-not-found">
                    <p className="font-display text-2xl tracking-tight text-[#731F17]">We couldn&rsquo;t find that name.</p>
                    <p className="font-body text-[#595959] mt-2 text-[0.95rem] leading-relaxed">
                      Check the spelling, try another member of your household, or contact us and we&rsquo;ll sort it out.
                    </p>
                  </div>
                )}
                {lookupState === "error" && (
                  <div className="rule-fine mt-10 pt-6" role="alert" data-testid="rsvp-lookup-error">
                    <p className="font-body text-[#731F17] text-[0.95rem]">Something went wrong on our end. Please try again in a moment.</p>
                  </div>
                )}

                {multiple && (
                  <form onSubmit={doDisambiguate} className="rule-fine mt-10 pt-6 space-y-6" data-testid="rsvp-disambiguate">
                    <p className="font-display text-2xl tracking-tight text-[#1A1A1A]">More than one party matches that name.</p>
                    <p className="font-body text-[#595959] text-[0.95rem]">
                      {multiple.method === "email"
                        ? "Enter the email address your invitation correspondence has used."
                        : "Enter the name of another person invited with your party."}
                    </p>
                    <div>
                      <label htmlFor="rsvp-disambiguator" className={labelCls}>
                        {multiple.method === "email" ? "Email address" : "Another invited member's name"}
                      </label>
                      <input
                        id="rsvp-disambiguator"
                        required
                        value={disambiguator}
                        onChange={(e) => setDisambiguator(e.target.value)}
                        className={inputCls}
                        data-testid="rsvp-disambiguate-input"
                      />
                    </div>
                    <button type="submit" disabled={busy} className={primaryBtn} data-testid="rsvp-disambiguate-submit">
                      {lookupState === "loading" ? "Checking the list…" : "Continue"} <ArrowRight size={14} />
                    </button>
                  </form>
                )}
              </StepShell>
            )}

            {step === "party" && party && (
              <StepShell stepKey="party">
                <h1 ref={headingRef} tabIndex={-1} className="font-display text-4xl sm:text-5xl tracking-tight text-[#1A1A1A] outline-none" data-testid="rsvp-party-title">
                  They look familiar?
                </h1>
                {members.length > 1 && (
                  <p className="overline-label mt-4 text-[#595959]">{party.display_name}</p>
                )}
                <div className="mt-10" data-testid="rsvp-party-list">
                  {members.map((m) => (
                    <div key={m.id} className="rule-fine py-4">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-label text-[0.75rem] tracking-[0.18em] uppercase text-[#1A1A1A]">
                          {m.first_name} {m.last_name}
                        </span>
                        <span className="font-label text-[0.6rem] tracking-[0.2em] uppercase text-[#595959]">Invited</span>
                      </div>
                      {m.plus_one_allowed && (
                        <div className="flex items-baseline justify-between gap-4 mt-2">
                          <span className="font-label text-[0.75rem] tracking-[0.18em] uppercase text-[#595959]">
                            Guest of {m.first_name} {m.last_name}
                          </span>
                          <span className="font-label text-[0.6rem] tracking-[0.2em] uppercase text-[#731F17]">Plus-one available</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-10 flex flex-wrap gap-4">
                  <button onClick={() => setStep("attendance")} className={primaryBtn} data-testid="rsvp-thats-us">
                    That&rsquo;s us <ArrowRight size={14} />
                  </button>
                  <button onClick={resetToLookup} className={secondaryBtn} data-testid="rsvp-not-quite">
                    Not quite
                  </button>
                </div>
              </StepShell>
            )}

            {step === "returning" && party && (
              <StepShell stepKey="returning">
                <h1 ref={headingRef} tabIndex={-1} className="font-display text-4xl sm:text-5xl tracking-tight text-[#1A1A1A] outline-none" data-testid="rsvp-welcome-back">
                  Welcome back.
                </h1>
                <p className="font-body text-[#595959] mt-4 text-[0.95rem]">
                  We already have a response for {party.display_name}.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <button onClick={() => setStep("attendance")} className={primaryBtn} data-testid="rsvp-view-update">
                    View or update RSVP <ArrowRight size={14} />
                  </button>
                  <button onClick={resetToLookup} className={secondaryBtn} data-testid="rsvp-not-my-party">
                    This isn&rsquo;t my party
                  </button>
                </div>
              </StepShell>
            )}

            {step === "attendance" && (
              <StepShell stepKey="attendance">
                <h1 ref={headingRef} tabIndex={-1} className="font-display text-4xl sm:text-5xl tracking-tight text-[#1A1A1A] outline-none" data-testid="rsvp-attendance-title">
                  Who&rsquo;s coming?
                </h1>
                <div className="mt-10 space-y-10">
                  {members.map((m) => {
                    const r = responses[m.id] || {};
                    return (
                      <div key={m.id} className="rule-fine pt-6" data-testid={`rsvp-guest-${m.id}`}>
                        <p className="font-display text-2xl tracking-tight text-[#1A1A1A]">
                          Will {m.first_name} be joining us?
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4" role="group" aria-label={`Attendance for ${m.first_name} ${m.last_name}`}>
                          <button
                            onClick={() => setResponses({ ...responses, [m.id]: { ...r, attending: true } })}
                            aria-pressed={r.attending === true}
                            className={`font-label text-[0.65rem] tracking-[0.16em] uppercase px-5 py-3.5 min-h-[44px] border transition-colors ${
                              r.attending === true ? "bg-[#731F17] text-[#F7F5F0] border-[#731F17]" : "border-[#1A1A1A]/40 hover:border-[#1A1A1A]"
                            }`}
                            data-testid={`rsvp-attending-yes-${m.id}`}
                          >
                            Yes, happily
                          </button>
                          <button
                            onClick={() => setResponses({ ...responses, [m.id]: { ...r, attending: false } })}
                            aria-pressed={r.attending === false}
                            className={`font-label text-[0.65rem] tracking-[0.16em] uppercase px-5 py-3.5 min-h-[44px] border transition-colors ${
                              r.attending === false ? "bg-[#1A1A1A] text-[#F7F5F0] border-[#1A1A1A]" : "border-[#1A1A1A]/40 hover:border-[#1A1A1A]"
                            }`}
                            data-testid={`rsvp-attending-no-${m.id}`}
                          >
                            Regretfully, no
                          </button>
                        </div>
                        {m.plus_one_allowed && r.attending === true && (
                          <div className="mt-6 max-w-sm">
                            <label htmlFor={`plusone-${m.id}`} className={labelCls}>Your guest&rsquo;s name</label>
                            <input
                              id={`plusone-${m.id}`}
                              value={r.plus_one_name || ""}
                              onChange={(e) => setResponses({ ...responses, [m.id]: { ...r, plus_one_name: e.target.value } })}
                              className={inputCls}
                              placeholder="Your invitation includes a guest"
                              data-testid={`rsvp-plusone-${m.id}`}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-12 flex flex-wrap gap-4">
                  <button onClick={() => setStep(existing ? "returning" : "party")} className={secondaryBtn} data-testid="rsvp-back-button">
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    onClick={() => setStep(afterAttendance)}
                    disabled={!allAnswered}
                    className={primaryBtn}
                    data-testid="rsvp-continue-button"
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                </div>
              </StepShell>
            )}

            {step === "events" && hasEvents && (
              <StepShell stepKey="events">
                <p className="overline-label text-[#731F17]" data-testid="rsvp-events-overline">The night before</p>
                <h1 ref={headingRef} tabIndex={-1} className="font-display text-4xl sm:text-5xl tracking-tight mt-4 text-[#1A1A1A] outline-none" data-testid="rsvp-events-title">
                  Rehearsal Dinner
                </h1>
                {(() => {
                  const ev = eventMembers[0]?.events?.find((e) => e.code === "REHEARSAL_DINNER");
                  const when = [ev?.date, ev?.start_time].filter(Boolean).join(" · ");
                  const where = [ev?.location, ev?.address].filter(Boolean).join(", ");
                  return (
                    <p className="font-body italic text-[#595959] mt-3 text-[0.95rem]" data-testid="rsvp-events-details">
                      {when || where ? `${[when, where].filter(Boolean).join(" — ")}` : "Details to follow."}
                    </p>
                  );
                })()}
                <div className="mt-10 space-y-10">
                  {eventMembers.map((m) =>
                    m.events.map((ev) => {
                      const key = `${m.id}:${ev.code}`;
                      const val = eventResponses[key];
                      return (
                        <div key={key} className="rule-fine pt-6" data-testid={`rsvp-event-${m.id}-${ev.code}`}>
                          <p className="font-display text-2xl tracking-tight text-[#1A1A1A]">
                            Will {m.first_name} join us for the rehearsal dinner?
                          </p>
                          <div className="flex flex-wrap gap-2 mt-4" role="group" aria-label={`Rehearsal dinner attendance for ${m.first_name} ${m.last_name}`}>
                            <button
                              onClick={() => setEventResponses({ ...eventResponses, [key]: true })}
                              aria-pressed={val === true}
                              className={`font-label text-[0.65rem] tracking-[0.16em] uppercase px-5 py-3.5 min-h-[44px] border transition-colors ${
                                val === true ? "bg-[#731F17] text-[#F7F5F0] border-[#731F17]" : "border-[#1A1A1A]/40 hover:border-[#1A1A1A]"
                              }`}
                              data-testid={`rsvp-event-yes-${m.id}`}
                            >
                              Yes, happily
                            </button>
                            <button
                              onClick={() => setEventResponses({ ...eventResponses, [key]: false })}
                              aria-pressed={val === false}
                              className={`font-label text-[0.65rem] tracking-[0.16em] uppercase px-5 py-3.5 min-h-[44px] border transition-colors ${
                                val === false ? "bg-[#1A1A1A] text-[#F7F5F0] border-[#1A1A1A]" : "border-[#1A1A1A]/40 hover:border-[#1A1A1A]"
                              }`}
                              data-testid={`rsvp-event-no-${m.id}`}
                            >
                              Regretfully, no
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="mt-12 flex flex-wrap gap-4">
                  <button onClick={() => setStep("attendance")} className={secondaryBtn} data-testid="rsvp-events-back-button">
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    onClick={() => setStep("details")}
                    disabled={!allEventsAnswered}
                    className={primaryBtn}
                    data-testid="rsvp-events-continue-button"
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                </div>
              </StepShell>
            )}

            {step === "details" && (
              <StepShell stepKey="details">
                <h1 ref={headingRef} tabIndex={-1} className="font-display text-4xl sm:text-5xl tracking-tight text-[#1A1A1A] outline-none" data-testid="rsvp-details-title">
                  The finer points
                </h1>
                <div className="mt-10 space-y-10">
                  {members.filter((m) => responses[m.id]?.attending).map((m) => {
                    const r = responses[m.id];
                    return (
                      <div key={m.id} className="rule-fine pt-6" data-testid={`rsvp-details-${m.id}`}>
                        <p className="font-display text-xl tracking-tight text-[#1A1A1A]">{m.first_name} {m.last_name}</p>
                        {mealEnabled && (
                          <div className="mt-5 max-w-sm">
                            <label htmlFor={`meal-${m.id}`} className={labelCls}>Entrée</label>
                            <select
                              id={`meal-${m.id}`}
                              value={r.meal_choice}
                              onChange={(e) => setResponses({ ...responses, [m.id]: { ...r, meal_choice: e.target.value } })}
                              className={`${inputCls} cursor-pointer`}
                              data-testid={`rsvp-meal-${m.id}`}
                            >
                              <option value="">Choose an entrée</option>
                              {status.meal_options.map((o) => (
                                <option key={o} value={o}>{o}</option>
                              ))}
                            </select>
                          </div>
                        )}
                        <div className="mt-5">
                          <label htmlFor={`dietary-${m.id}`} className={labelCls}>Anything the kitchen should know?</label>
                          <p className="font-body italic text-[#595959]/80 text-xs mb-2">
                            Allergies, dietary restrictions, or anything else useful before we feed you.
                          </p>
                          <input
                            id={`dietary-${m.id}`}
                            value={r.dietary_notes}
                            onChange={(e) => setResponses({ ...responses, [m.id]: { ...r, dietary_notes: e.target.value } })}
                            className={inputCls}
                            placeholder="None, we hope"
                            data-testid={`rsvp-dietary-${m.id}`}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {attendingCount > 0 && (
                    <div className="rule-fine pt-6">
                      <label htmlFor="rsvp-accessibility" className={labelCls}>Anything we can do to make the evening more comfortable?</label>
                      <p className="font-body italic text-[#595959]/80 text-xs mb-2">
                        Accessibility needs, mobility considerations, or anything else worth knowing.
                      </p>
                      <input
                        id="rsvp-accessibility"
                        value={details.accessibility_notes}
                        onChange={(e) => setDetails({ ...details, accessibility_notes: e.target.value })}
                        className={inputCls}
                        data-testid="rsvp-accessibility-input"
                      />
                    </div>
                  )}

                  <div className="rule-fine pt-6">
                    <label htmlFor="rsvp-song" className={labelCls}>One song you would be disappointed not to hear</label>
                    <p className="font-body italic text-[#595959]/80 text-xs mb-2">
                      This is a request, not a legally binding agreement.
                    </p>
                    <input
                      id="rsvp-song"
                      value={details.song_request}
                      onChange={(e) => setDetails({ ...details, song_request: e.target.value })}
                      className={inputCls}
                      data-testid="rsvp-song-input"
                    />
                  </div>

                  <div className="rule-fine pt-6">
                    <label htmlFor="rsvp-note" className={labelCls}>A note for the couple (optional)</label>
                    <textarea
                      id="rsvp-note"
                      rows={3}
                      value={details.message_to_couple}
                      onChange={(e) => setDetails({ ...details, message_to_couple: e.target.value })}
                      className={`${inputCls} resize-none`}
                      data-testid="rsvp-note-input"
                    />
                  </div>
                </div>
                <div className="mt-12 flex flex-wrap gap-4">
                  <button onClick={() => setStep(afterAttendance)} className={secondaryBtn} data-testid="rsvp-details-back-button">
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button onClick={() => setStep("contact")} className={primaryBtn} data-testid="rsvp-details-continue-button">
                    Continue <ArrowRight size={14} />
                  </button>
                </div>
              </StepShell>
            )}

            {step === "contact" && (
              <StepShell stepKey="contact">
                <h1 ref={headingRef} tabIndex={-1} className="font-display text-4xl sm:text-5xl tracking-tight text-[#1A1A1A] outline-none" data-testid="rsvp-contact-title">
                  Where should we send your confirmation?
                </h1>
                <p className="font-body text-[#595959] mt-4 text-[0.95rem]">
                  One email per party — used for your confirmation, a link to update your response, and the occasional essential dispatch.
                </p>
                <div className="mt-10 max-w-md">
                  <label htmlFor="rsvp-email" className={labelCls}>Email</label>
                  <input
                    id="rsvp-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls}
                    data-testid="rsvp-email-input"
                  />
                </div>
                <div className="mt-12 flex flex-wrap gap-4">
                  <button onClick={() => setStep("details")} className={secondaryBtn} data-testid="rsvp-contact-back-button">
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    onClick={() => {
                      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                        toast.error("A valid email helps the confirmation find you.");
                        return;
                      }
                      setStep("review");
                    }}
                    className={primaryBtn}
                    data-testid="rsvp-contact-continue-button"
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                </div>
              </StepShell>
            )}

            {step === "review" && (
              <StepShell stepKey="review">
                <h1 ref={headingRef} tabIndex={-1} className="font-display text-4xl sm:text-5xl tracking-tight text-[#1A1A1A] outline-none" data-testid="rsvp-review-title">
                  One last look
                </h1>
                <div className="mt-10" data-testid="rsvp-review-list">
                  {members.map((m) => {
                    const r = responses[m.id] || {};
                    return (
                      <div key={m.id} className="rule-fine py-5 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-baseline">
                        <div>
                          <p className="font-display text-2xl tracking-tight text-[#1A1A1A]">{m.first_name} {m.last_name}</p>
                          <p className="font-body text-sm text-[#595959] mt-1 leading-relaxed">
                            {r.attending ? (
                              <>
                                {r.plus_one_name && <>Bringing {r.plus_one_name}. </>}
                                {mealEnabled && r.meal_choice && <>{r.meal_choice}. </>}
                                {r.dietary_notes && <>Kitchen note: {r.dietary_notes}.</>}
                              </>
                            ) : (
                              <>Sending regrets.</>
                            )}
                          </p>
                        </div>
                        <span className={`font-label text-[0.62rem] tracking-[0.18em] uppercase ${r.attending ? "text-[#731F17]" : "text-[#595959]"}`}>
                          {r.attending ? "Yes, happily" : "Regretfully, no"}
                        </span>
                      </div>
                    );
                  })}
                  {hasEvents && (
                    <div className="rule-fine py-5" data-testid="rsvp-review-events">
                      <p className="overline-label text-[#731F17] mb-3">The night before — Rehearsal Dinner</p>
                      {eventMembers.map((m) =>
                        m.events.map((ev) => {
                          const val = eventResponses[`${m.id}:${ev.code}`];
                          return (
                            <div key={`${m.id}:${ev.code}`} className="flex items-baseline justify-between gap-4 py-1">
                              <span className="font-body text-sm text-[#1A1A1A]">{m.first_name} {m.last_name}</span>
                              <span className={`font-label text-[0.62rem] tracking-[0.18em] uppercase ${val ? "text-[#731F17]" : "text-[#595959]"}`}>
                                {val ? "Yes, happily" : "Regretfully, no"}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                  {(details.accessibility_notes || details.song_request || details.message_to_couple) && (
                    <div className="rule-fine py-5 font-body text-sm text-[#595959] leading-relaxed">
                      {details.accessibility_notes && <p>Comfort notes: {details.accessibility_notes}</p>}
                      {details.song_request && <p>Song request: &ldquo;{details.song_request}&rdquo;</p>}
                      {details.message_to_couple && <p>Note: &ldquo;{details.message_to_couple}&rdquo;</p>}
                    </div>
                  )}
                  <div className="rule-fine py-5 flex items-baseline justify-between gap-4">
                    <span className="overline-label">Confirmation to</span>
                    <span className="font-body text-sm text-[#1A1A1A]" data-testid="rsvp-review-email">{email}</span>
                  </div>
                </div>
                <div className="mt-12 flex flex-wrap gap-4">
                  <button onClick={() => setStep("attendance")} className={secondaryBtn} data-testid="rsvp-make-change">
                    <ArrowLeft size={14} /> Make a change
                  </button>
                  <button onClick={doSubmit} disabled={busy} className={primaryBtn} data-testid="rsvp-submit-button">
                    {busy ? "Sealing the envelope…" : "Send my response"}
                  </button>
                </div>
              </StepShell>
            )}

            {step === "done" && result && (
              <StepShell stepKey="confirmation">
                <div className="text-center py-6" data-testid="rsvp-confirmation">
                  <figure className="border border-[#1A1A1A]/25 bg-[#F2EFE9] p-2.5 max-w-md mx-auto mb-10" data-testid="rsvp-confirmation-figure">
                    <img
                      src="/illustrations/taxi.png"
                      alt="Ink-and-wash illustration of a yellow taxi crossing Manhattan at night, evening shoes riding along"
                      className="w-full h-52 object-cover"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.closest("figure").style.display = "none"; }}
                      data-testid="rsvp-confirmation-illustration"
                    />
                  </figure>
                  <Seal size={80} className="mx-auto" />
                  {result.attending_any ? (
                    <>
                      <h1 className="font-display text-5xl sm:text-6xl tracking-tight mt-10 text-[#731F17]" data-testid="rsvp-confirmation-headline">
                        You&rsquo;re in.
                      </h1>
                      <p className="font-body italic text-[#595959] mt-5 text-lg">
                        We&rsquo;ll see you in New York on June 5.
                      </p>
                      <div className="mt-10 stamp-land inline-block">
                        <DateStamp text={content.date.stamp} />
                      </div>
                      <div className="mt-10 flex flex-wrap justify-center gap-3">
                        <a
                          href={googleCalUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${secondaryBtn} inline-flex`}
                          data-testid="rsvp-add-calendar-google"
                        >
                          <CalendarPlus size={14} /> Google Calendar
                        </a>
                        <a
                          href={outlookCalUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${secondaryBtn} inline-flex`}
                          data-testid="rsvp-add-calendar-outlook"
                        >
                          <CalendarPlus size={14} /> Outlook
                        </a>
                        <button onClick={downloadIcs} className={secondaryBtn} data-testid="rsvp-add-calendar-ics">
                          <Download size={14} /> Download .ICS
                        </button>
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
                  <Link to="/" className={`${secondaryBtn} inline-flex mt-10`} data-testid="rsvp-confirmation-home-button">
                    Back to the wedding
                  </Link>
                </div>
              </StepShell>
            )}
          </AnimatePresence>
        </div>
      </main>
    </MotionConfig>
  );
};

export default RSVP;
