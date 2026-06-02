export const homeContent = {
  hero: {
    /* Proposed headlines — choose one or use your own */
    headlines: [
      "Equipping South African science since 1979",           /* Option A — legacy-led */
      "The laboratory behind South Africa's laboratories",    /* Option B — B2B authority */
      "45 years. Every instrument. Every sector.",            /* Option C — depth + range */
    ],
    /* Active headline used on the site */
    headline: "The laboratory behind South Africa's laboratories",
    subheadline:
      "Premium laboratory equipment and scientific instruments — supplied, supported, and serviced by people who know science.",
    cta: { label: "Request a quote", href: "/quote" },
    ctaSecondary: { label: "Explore brands", href: "/brands" },
  },

  valuePillars: [
    {
      title: "Unmatched Range",
      stat: "10+",
      statLabel: "world-leading brands",
      body: "From precision balances to rotary evaporators — if a South African lab needs it, we distribute it.",
    },
    {
      title: "Expert Support",
      stat: "3",
      statLabel: "internationally trained technicians",
      body: "On-site installation, calibration, and repair. We don't just sell instruments — we keep them running.",
    },
    {
      title: "45 Years of Trust",
      stat: "1979",
      statLabel: "founded in Johannesburg",
      body: "Deep supplier relationships built over four decades. Access to product depth and priority support that newer distributors simply can't match.",
    },
  ],

  marqueeText: "45 YEARS",

  story: {
    headline: "Four decades of equipping South African science",
    body: "Founded in 1979 by Mandy in Edenvale, Johannesburg, Labex has grown from a specialist importer into the go-to distributor for research, pharma, and chemical laboratories across Southern Africa.",
    milestones: [
      { year: "1979", event: "Labex founded in Edenvale, Johannesburg" },
      { year: "1985", event: "First pharmaceutical sector clients" },
      { year: "1994", event: "Expanded to national distribution" },
      { year: "2002", event: "ISO-certified service centre opened" },
      { year: "2010", event: "Heidolph & Sartorius partnerships formalised" },
      { year: "2018", event: "Internationally trained technical team established" },
      { year: "2024", event: "Digital infrastructure rebuild begins" },
      { year: "2026", event: "New era — Labex online" },
    ],
  },

  whyLabex: {
    headline: "Why labs across Southern Africa choose Labex",
    testimonials: [
      {
        quote:
          "Labex has been our go-to supplier for over 15 years. The technical support is genuinely exceptional — they've saved us from major downtime more than once.",
        author: "Head of Analytical Chemistry",
        company: "Leading SA research institution",
        placeholder: true,
      },
      {
        quote:
          "We source across multiple distributors, but for anything critical, we go to Labex. Their product knowledge is unmatched in the SA market.",
        author: "QC Manager",
        company: "Pharmaceutical manufacturer, Gauteng",
        placeholder: true,
      },
      {
        quote:
          "Fast quotes, honest advice, and the products actually arrive. After dealing with other distributors, that sounds basic — but it's rarer than it should be.",
        author: "Laboratory Manager",
        company: "Chemical processing company",
        placeholder: true,
      },
    ],
  },

  team: {
    headline: "The people behind the products",
    subheadline:
      "Real expertise. Real relationships. Not a call centre — your dedicated team.",
    members: [
      {
        name: "Our Senior Technician",
        role: "Senior Service Technician",
        monogram: "ST",
        bio: "Internationally trained in Germany. Specialist in rotary evaporators and precision balances.",
      },
      {
        name: "Our Field Technician",
        role: "Field Service Technician",
        monogram: "FT",
        bio: "On-site calibration, installation, and repair across Gauteng and neighbouring provinces.",
      },
      {
        name: "Our Sales Specialist",
        role: "Technical Sales Specialist",
        monogram: "TS",
        bio: "20 years in scientific instruments. Speaks your application language, not just product spec sheets.",
      },
    ],
  },

  contact: {
    address: "88 17th Avenue, Edenvale, Johannesburg, 1609",
    phone: "(011) 728 1338",
    email: "sales@labex.co.za",
    whatsapp: "+27 XX XXX XXXX", /* TODO: Confirm WhatsApp Business number */
    hours: "Monday – Friday: 08:00 – 17:00 (SAST)",
  },
} as const;
