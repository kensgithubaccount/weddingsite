export const SITE_PHASE = "full-wedding";

const PHASES = {
  "save-the-date": {
    rsvpEnabled: false,
    sections: {
      invitation: true,
      evening: false,
      story: false,
      weddingParty: false,
      attire: false,
      questions: false,
      registry: false,
      newYork: true,
    },
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
      attire: true,
      questions: true,
      registry: true,
      newYork: true,
    },
    ads: {
      taxi: true,
      subway: true,
    },
  },
};

export const phaseConfig = PHASES[SITE_PHASE] || PHASES["full-wedding"];
