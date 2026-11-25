/*
 * Sentry Access website configuration.
 *
 * Edit this file before publishing. No secret keys belong here.
 * Stripe checkout is created by the keytrack-license Cloudflare Worker.
 * Payment Links are still supported as a public fallback URL.
 *
 * See website/README.md for Stripe and deployment details.
 */
window.SENTRY_SITE_CONFIG = {
  brand: 'Sentry Access',
  legalEntity: 'Vybelive LLC',
  contactEmail: 'sales@sentryaccess.net',
  /** Optional scheduling link for deployment calls. */
  calendlyUrl: '',
  /** Stripe Checkout endpoint (hosted sessions via the license worker). */
  checkoutEndpoint:
    'https://keytrack-license.joshua-c77.workers.dev/api/sentry/checkout-session',
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
