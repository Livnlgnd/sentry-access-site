(() => {
  'use strict'

  // Progressive enhancement: reveal animations only apply when JS is running.
  document.documentElement.classList.remove('no-js')
  document.documentElement.classList.add('js')

  const defaults = {
    brand: 'Sentry Access',
    legalEntity: 'Vybelive LLC',
    contactEmail: 'joshua@keyauditpro.com',
    calendlyUrl: '',
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
    stripeLinks: {
      starter: '',
      pro: '',
      annualStarter: '',
      annualPro: '',
      doorPack: '',
      cameraPack: '',
    },
  }

  const config = { ...defaults, ...(window.SENTRY_SITE_CONFIG || {}) }
  config.pricing = { ...defaults.pricing, ...(config.pricing || {}) }
  config.stripeLinks = {
    ...defaults.stripeLinks,
    ...(config.stripeLinks || {}),
    ...(window.SENTRY_STRIPE_LINKS || {}),
  }

  const planMeta = {
    starter: {
      name: 'Starter license',
      priceKey: 'starter',
      blurb:
        'Perpetual single-kiosk license for one site: 2 doors, 4 camera streams, and local audit. No LAN hub.',
    },
    pro: {
      name: 'Pro license',
      priceKey: 'pro',
      blurb:
        'Perpetual site license: 4 kiosks, 4 doors, 8 camera streams, and the LAN hub.',
    },
    annualStarter: {
      name: 'Starter annual support',
      priceKey: 'annualStarter',
      blurb:
        'Optional annual plan: major version upgrades, encrypted off-site backup, and priority commissioning support.',
    },
    annualPro: {
      name: 'Pro annual support',
      priceKey: 'annualPro',
      blurb:
        'Optional annual plan: major version upgrades, encrypted off-site backup, and priority commissioning support.',
    },
    doorPack: {
      name: 'Extra Door Pack',
      priceKey: 'doorPack',
      blurb:
        'Adds one Axis VAPIX or HTTP relay door binding to a Pro license. Quantity can be adjusted at checkout.',
    },
    cameraPack: {
      name: 'Camera Gateway Pack',
      priceKey: 'cameraPack',
      blurb:
        'Adds four FFmpeg + face-matching camera streams to a Pro license. Quantity can be adjusted at checkout.',
    },
    integrator: {
      name: 'Integrator program',
      priceKey: null,
      blurb:
        'Founding integrator terms include a demo license, joint commissioning, and direct pricing.',
    },
    'multi-site': {
      name: 'Multi-site quote',
      priceKey: null,
      blurb:
        'Tell us the site and door count. Multi-site and 10+ door deployments are quoted directly.',
    },
    'deployment-call': {
      name: 'Deployment call',
      priceKey: null,
      blurb:
        'A short technical call to review the site, controller, cameras, and timeline.',
    },
    'technical-review': {
      name: 'Technical review',
      priceKey: null,
      blurb:
        'Security questionnaire, architecture review, or spec-sheet walkthrough for your client.',
    },
  }

  const money = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: config.pricing.currency || 'USD',
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0)

  const isPlaceholderEmail = (email) =>
    !email || /your-company|example\.com/i.test(email)

  const byConfig = (key) =>
    Array.from(document.querySelectorAll(`[data-config="${key}"]`))

  const byPrice = (key) =>
    Array.from(document.querySelectorAll(`[data-price="${key}"]`))

  function fillConfig() {
    document.documentElement.dataset.brand = config.brand

    byConfig('brand').forEach((node) => {
      node.textContent = config.brand
    })
    byConfig('legal-entity').forEach((node) => {
      node.textContent = config.legalEntity
    })
    byConfig('jurisdiction').forEach((node) => {
      node.textContent = config.jurisdiction
    })
    byConfig('email').forEach((node) => {
      node.textContent = config.contactEmail
      if (node.tagName === 'A') node.href = `mailto:${config.contactEmail}`
    })
    byConfig('email-href').forEach((node) => {
      node.href = `mailto:${config.contactEmail}`
      node.setAttribute('aria-label', `Email ${config.contactEmail}`)
    })
    byConfig('calendly').forEach((node) => {
      if (!config.calendlyUrl) {
        node.hidden = true
      } else {
        node.hidden = false
        node.href = config.calendlyUrl
      }
    })

    for (const key of [
      'starter',
      'pro',
      'annualStarter',
      'annualPro',
      'doorPack',
      'cameraPack',
    ]) {
      byPrice(key).forEach((node) => {
        node.textContent = money(config.pricing[key])
      })
    }

    const year = document.querySelector('[data-year]')
    if (year) year.textContent = String(new Date().getFullYear())

    if (isPlaceholderEmail(config.contactEmail)) {
      document.documentElement.dataset.contactUnset = 'true'
      console.warn(
        '[Sentry site] Set contactEmail in assets/config.js before publishing.',
      )
    }
  }

  function setupHeader() {
    const header = document.querySelector('.site-header')
    const toggle = document.querySelector('.nav-toggle')
    if (!header) return

    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    if (!toggle) return
    toggle.addEventListener('click', () => {
      const open = header.classList.toggle('nav-open')
      toggle.setAttribute('aria-expanded', String(open))
    })

    header.querySelectorAll('.mobile-nav a, .mobile-nav .btn').forEach((link) => {
      link.addEventListener('click', () => {
        header.classList.remove('nav-open')
        toggle.setAttribute('aria-expanded', 'false')
      })
    })
  }

  function setupReveal() {
    const elements = Array.from(document.querySelectorAll('[data-reveal]'))
    if (!elements.length) return

    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    elements.forEach((element) => observer.observe(element))
  }

  function setupDialog() {
    const dialog = document.getElementById('contact-dialog')
    if (!dialog) return null

    const close = () => {
      if (dialog.open) dialog.close()
    }

    dialog.querySelectorAll('[data-dialog-close]').forEach((button) => {
      button.addEventListener('click', close)
    })

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) close()
    })

    return dialog
  }

  function openContact(planKey, dialog) {
    if (!dialog) return
    const plan = planMeta[planKey]
    const planNode = dialog.querySelector('[data-dialog-plan]')
    const priceNode = dialog.querySelector('[data-dialog-price]')
    const blurbNode = dialog.querySelector('[data-dialog-blurb]')
    const emailLink = dialog.querySelector('[data-dialog-email]')
    const copyButton = dialog.querySelector('[data-dialog-copy]')
    const note = dialog.querySelector('[data-dialog-note]')

    const name = plan ? plan.name : 'Sentry Access'
    const price = plan?.priceKey
      ? money(config.pricing[plan.priceKey])
      : plan
        ? 'Custom'
        : ''
    const subject = `Sentry Access inquiry: ${name}`
    const body = [
      `Hi ${config.brand} team,`,
      '',
      `I am interested in: ${name}`,
      '',
      'Company:',
      'Role:',
      'Sites:',
      'Doors:',
      'Cameras:',
      'Timeline:',
      '',
      'Please contact me to scope the deployment.',
    ].join('\n')

    if (planNode) planNode.textContent = name
    if (priceNode) priceNode.textContent = price
    if (blurbNode) blurbNode.textContent = plan ? plan.blurb : ''
    if (emailLink) {
      emailLink.href = `mailto:${config.contactEmail}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`
      emailLink.textContent = `Email ${config.contactEmail}`
    }
    if (copyButton) {
      copyButton.dataset.email = config.contactEmail
    }
    if (note) {
      note.textContent =
        'Include your site count, doors, cameras, and timeline for a faster quote.'
    }

    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal()
    } else {
      window.location.href = emailLink ? emailLink.href : `mailto:${config.contactEmail}`
    }
  }

  function setupCheckout(dialog) {
    document.querySelectorAll('[data-checkout]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault()
        const planKey = button.getAttribute('data-checkout')
        const link = config.stripeLinks[planKey]
        if (typeof link === 'string' && /^https:\/\//i.test(link)) {
          window.location.assign(link)
          return
        }
        openContact(planKey, dialog)
      })
    })

    document.querySelectorAll('[data-contact]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault()
        openContact(button.getAttribute('data-contact') || '', dialog)
      })
    })

    const copyButton = dialog?.querySelector('[data-dialog-copy]')
    if (copyButton) {
      copyButton.addEventListener('click', async () => {
        const email = copyButton.dataset.email || config.contactEmail
        try {
          await navigator.clipboard.writeText(email)
          copyButton.textContent = 'Copied'
          setTimeout(() => {
            copyButton.textContent = 'Copy email'
          }, 1600)
        } catch {
          copyButton.textContent = email
        }
      })
    }
  }

  function setupCheckoutBanner() {
    const banner = document.querySelector('[data-checkout-success]')
    if (!banner) return
    const params = new URLSearchParams(window.location.search)
    if (params.get('checkout') === 'success') {
      banner.hidden = false
      banner.scrollIntoView({ block: 'center' })
    }
  }

  function setupTour() {
    const shell = document.querySelector('[data-tour]')
    if (!shell) return

    const tabs = Array.from(shell.querySelectorAll('[data-tour-tab]'))
    const panels = Array.from(shell.querySelectorAll('[data-tour-panel]'))
    const count = shell.querySelector('[data-tour-count]')
    const dots = Array.from(
      shell.querySelectorAll('.tour-progress i'),
    )
    const next = shell.querySelector('[data-tour-next]')
    const prev = shell.querySelector('[data-tour-prev]')
    const play = shell.querySelector('[data-tour-play]')

    let index = 0
    let timer = null
    let playing = false

    const stop = () => {
      if (timer) window.clearInterval(timer)
      timer = null
      playing = false
      if (play) play.textContent = 'Play tour'
    }

    const render = (nextIndex) => {
      index = (nextIndex + panels.length) % panels.length
      tabs.forEach((tab, tabIndex) => {
        const active = tabIndex === index
        tab.setAttribute('aria-selected', String(active))
        tab.tabIndex = active ? 0 : -1
      })
      panels.forEach((panel, panelIndex) => {
        panel.hidden = panelIndex !== index
      })
      if (count) {
        count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(
          panels.length,
        ).padStart(2, '0')}`
      }
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === index)
      })
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        stop()
        render(Number(tab.getAttribute('data-tour-tab')))
      })
      tab.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault()
          stop()
          render(index + 1)
          tabs[index]?.focus()
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault()
          stop()
          render(index - 1)
          tabs[index]?.focus()
        }
      })
    })

    next?.addEventListener('click', () => {
      stop()
      render(index + 1)
    })
    prev?.addEventListener('click', () => {
      stop()
      render(index - 1)
    })
    play?.addEventListener('click', () => {
      if (playing) {
        stop()
        return
      }
      playing = true
      play.textContent = 'Pause tour'
      timer = window.setInterval(() => render(index + 1), 5500)
    })

    render(0)
  }

  function setupPrint() {
    document.querySelectorAll('[data-print]').forEach((button) => {
      button.addEventListener('click', () => window.print())
    })
  }

  function setupNavState() {
    const path = window.location.pathname.split('/').pop() || 'index.html'
    document.querySelectorAll('.nav a, .mobile-nav a').forEach((link) => {
      const target = link.getAttribute('href') || ''
      if (target === path) link.setAttribute('aria-current', 'page')
    })
  }

  fillConfig()
  setupHeader()
  setupReveal()
  const dialog = setupDialog()
  setupCheckout(dialog)
  setupCheckoutBanner()
  setupTour()
  setupPrint()
  setupNavState()

  window.SentrySite = {
    config,
    openContact: (plan) => openContact(plan, dialog),
    isConfigured: {
      stripe: Object.values(config.stripeLinks).some((value) =>
        /^https:\/\//i.test(value || ''),
      ),
      email: !isPlaceholderEmail(config.contactEmail),
    },
  }
})()
