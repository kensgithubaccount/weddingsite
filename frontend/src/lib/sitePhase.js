const PHASES = {
  "save-the-date": {
    rsvpEnabled: false,
    sections: {
      invitation: true,
      evening: false,
      story: true,
      weddingParty: false,
      hotel: true,
      attire: false,
      questions: true,
      registry: false,
      newYork: true,
    },
    faqHiddenQuestions: [
      "What time should I arrive?",
      "What should I wear?",
      "What happens after 11:30 PM?",
    ],
    ads: {
      taxi: true,
      subway: true,
    },
  },
  "full-wedding": {
    rsvpEnabled: true,
    sections: {
      invitation: true,
      evening: true,
      story: true,
      weddingParty: true,
      hotel: true,
      attire: true,
      questions: true,
      registry: true,
      newYork: true,
    },
    faqHiddenQuestions: [],
    ads: {
      taxi: true,
      subway: true,
    },
  },
};

// Codespaces/local previews can switch versions with ?phase=save-the-date or ?phase=full-wedding.
// The public deployment ignores that query parameter unless REACT_APP_ENABLE_PHASE_TOGGLE=true.
const host = typeof window !== "undefined" ? window.location.hostname : "";
const isLocalPreview =
  host === "localhost" ||
  host === "127.0.0.1" ||
  host.endsWith(".app.github.dev") ||
  host.endsWith(".github.dev");

export const phasePreviewEnabled =
  isLocalPreview || process.env.REACT_APP_ENABLE_PHASE_TOGGLE === "true";

const requestedPreviewPhase =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("phase")
    : null;

const configuredPhase = process.env.REACT_APP_SITE_PHASE || "save-the-date";

export const SITE_PHASE =
  phasePreviewEnabled && PHASES[requestedPreviewPhase]
    ? requestedPreviewPhase
    : PHASES[configuredPhase]
      ? configuredPhase
      : "save-the-date";

export const phaseConfig = PHASES[SITE_PHASE];
