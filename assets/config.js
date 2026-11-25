/*
 * Sentry Access website configuration.
 *
 * Edit this file before publishing. No secret keys belong here.
 * Stripe Payment Links are public URLs and are safe to commit.
 *
 * To generate the links in your own Stripe account, see website/README.md
 * or run: npm run site:stripe
 */
window.SENTRY_SITE_CONFIG = {
  brand: 'Sentry Access',
  legalEntity: 'Vybelive LLC',
  contactEmail: 'joshua@keyauditpro.com',
  /** Optional scheduling link for deployment calls. */
  calendlyUrl: '',
  /** Used in the Terms page. Matches the KeyAudit Pro terms. */
  jurisdiction: 'the state in which Vybelive LLC is organized',

  pricing: {
    currency: 'USD',
    starter: 750,
    pro: 1500,
    annualStarter: 150,
    annualPro: 300,
    doorPack: 350,
    cameraPack: 250,
  },

  /**
   * Paste Stripe Payment Links here, or let scripts/stripe-setup.mjs fill
   * assets/stripe.generated.js automatically.
   */
  stripeLinks: {
    starter: '',
    pro: '',
    annualStarter: '',
    annualPro: '',
    doorPack: '',
    cameraPack: '',
  },
}
