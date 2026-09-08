export const SITE_PHASE = process.env.REACT_APP_SITE_PHASE || "save-the-date";

const PHASES = {
  "save-the-date": {
    rsvpEnabled: false,
    sections: {
      invitation: true,
      evening: false,
      story: true,
      weddingParty: true,
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

export const phaseConfig = PHASES[SITE_PHASE] || PHASES["save-the-date"];
