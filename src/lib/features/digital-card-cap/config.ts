// Configuration for Digital Card Submission Cap Feature

export const MAX_SUBMISSIONS = 100;

export const DIGITAL_CARD_SETTINGS_DOC_PATH = 'app_settings/digital-card-submissions';

export const DEFAULT_SUBMISSION_SETTINGS = {
  currentCount: 0,
  maxAllowed: MAX_SUBMISSIONS,
  isAccepting: true,
  waitlistEmails: [],
};

export const MESSAGES = {
  capReached: {
    title: "We've reached capacity!",
    subtitle: "Our digital business card program is currently at capacity.",
    description: "Join our waitlist to be notified when spots become available. We're committed to providing exceptional service to each professional, which means limiting our initial rollout.",
  },
  waitlist: {
    success: "You've been added to the waitlist! We'll notify you when spots open up.",
    alreadyOnList: "You're already on the waitlist. We'll notify you when spots become available.",
    error: "Something went wrong. Please try again.",
  },
  spotsRemaining: (count: number) =>
    count <= 10
      ? `Only ${count} spots remaining!`
      : `${count} spots remaining`,
};
