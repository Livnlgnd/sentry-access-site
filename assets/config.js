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
  legalEntity: 'Sentry Access',
  contactEmail: 'sales@your-company.com',
  /** Optional scheduling link, e.g. https://cal.com/your-team/deployment. */
  calendlyUrl: '',
  /** Used in the Terms page. Replace before accepting payments. */
  jurisdiction: 'the State of [Your State]',

  pricing: {
    currency: 'USD',
    pilot: 1500,
    singleSite: 4900,
    support: 1200,
  },

  /**
   * Paste Stripe Payment Links here, or let scripts/stripe-setup.mjs fill
   * assets/stripe.generated.js automatically.
   */
  stripeLinks: {
    pilot: '',
    singleSite: '',
    support: '',
  },
}
