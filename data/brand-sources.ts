/**
 * brand-sources.ts
 *
 * Canonical manufacturer URL patterns for known brands.
 * Used by fetch-product-images.ts to locate product pages.
 */

export interface BrandSource {
  domain: string;
  productListUrl: string;
  searchUrl: string | null;       // {query} placeholder
  productPagePattern: string | null; // {model}, {slug}, {category} placeholders
  imageSelector: string;          // CSS selector for primary product image
  notes: string;
}

export const BRAND_SOURCES: Record<string, BrandSource> = {
  Atago: {
    domain: 'www.atago.net',
    productListUrl: 'https://www.atago.net/en/products-top.php',
    searchUrl: 'https://www.atago.net/en/search.php?keyword={query}',
    productPagePattern: null, // use search
    imageSelector: '.product-image img, .main-image img, [itemprop="image"]',
    notes: 'AP-100 may be discontinued — current line is AP-300. RX-5000 is active. Check og:image first.',
  },
  Labconco: {
    domain: 'www.labconco.com',
    productListUrl: 'https://www.labconco.com/products',
    searchUrl: 'https://www.labconco.com/products?search={query}',
    productPagePattern: 'https://www.labconco.com/product/{slug}',
    imageSelector: '.product-hero img, .product-gallery img, [itemprop="image"]',
    notes: 'Glove box SKUs: 50600-00, 50600-02 etc. Labconco has good og:image tags.',
  },
  IKA: {
    domain: 'www.ika.com',
    productListUrl: 'https://www.ika.com/en/Products-LabEq/',
    searchUrl: 'https://www.ika.com/en/?searchquery={query}',
    productPagePattern: null, // use search
    imageSelector: '.product-detail-image img, .gallery-image img',
    notes: 'S 50 N = Ultra-Turrax. T 25, T 18 also in this series. Use model number in search.',
  },
  Huxley: {
    domain: 'www.labsupply.co.za',
    productListUrl: 'https://www.labsupply.co.za/shop/lab-equipment/autoclaves/',
    searchUrl: null,
    productPagePattern: 'https://www.labsupply.co.za/shop/lab-equipment/autoclaves/{slug}/',
    imageSelector: '.woocommerce-product-gallery img, .product img',
    notes: 'No official Huxley manufacturer site found. Taiwan OEM. Fetching from SA distributor labsupply.co.za.',
  },
  Heidolph: {
    domain: 'www.heidolph-instruments.com',
    productListUrl: 'https://www.heidolph-instruments.com/en/products',
    searchUrl: 'https://www.heidolph-instruments.com/en/search?q={query}',
    productPagePattern: null,
    imageSelector: '.product-image img, .product-gallery__main img',
    notes: 'Hei-VAP series rotary evaporators. Good og:image coverage.',
  },
  Snijders: {
    domain: 'snijderslabs.com',
    productListUrl: 'https://snijderslabs.com/product-range',
    searchUrl: 'https://snijderslabs.com/?s={query}',
    productPagePattern: null,
    imageSelector: '.product-image img, .product-hero img, figure img',
    notes: 'Rebranded from Snijders Scientific to Snijders Labs. DF8154 = ultra-low. UDF = ultra-deep.',
  },
  Memmert: {
    domain: 'www.memmert.com',
    productListUrl: 'https://www.memmert.com/products/',
    searchUrl: 'https://www.memmert.com/products/?search={query}',
    productPagePattern: null,
    imageSelector: '.product-image img, .stage__image img',
    notes: 'Ovens, incubators, water baths. Good og:image.',
  },
  Elma: {
    domain: 'www.elma-ultrasonic.com',
    productListUrl: 'https://www.elma-ultrasonic.com/en/products/',
    searchUrl: null,
    productPagePattern: null,
    imageSelector: '.product-image img',
    notes: 'Ultrasonic cleaners.',
  },
  Eppendorf: {
    domain: 'www.eppendorf.com',
    productListUrl: 'https://www.eppendorf.com/en/products/',
    searchUrl: 'https://www.eppendorf.com/en/search/?q={query}',
    productPagePattern: null,
    imageSelector: '.product-gallery img, .product-image img',
    notes: 'Centrifuges, pipettes. Heavy JS rendering — og:image most reliable.',
  },
  'Thermo Scientific': {
    domain: 'www.thermofisher.com',
    productListUrl: 'https://www.thermofisher.com/za/en/home/products-and-services.html',
    searchUrl: 'https://www.thermofisher.com/search/results?query={query}&focusarea=Search All',
    productPagePattern: null,
    imageSelector: '.product-hero__image img, .product-image img',
    notes: 'Very JS-heavy. og:image is the most reliable extraction path.',
  },
  Sartorius: {
    domain: 'www.sartorius.com',
    productListUrl: 'https://www.sartorius.com/en/products',
    searchUrl: 'https://www.sartorius.com/en/search#q={query}',
    productPagePattern: null,
    imageSelector: '.product-image img, [itemprop="image"]',
    notes: 'Analytical balances, centrifuges.',
  },
  Buchi: {
    domain: 'www.buchi.com',
    productListUrl: 'https://www.buchi.com/en/products',
    searchUrl: 'https://www.buchi.com/en/search?keywords={query}',
    productPagePattern: null,
    imageSelector: '.product-image img, .hero-image img',
    notes: 'R-220, R-300 rotary evaporators. Good og:image.',
  },
  VELP: {
    domain: 'www.velp.com',
    productListUrl: 'https://www.velp.com/en-ww/products',
    searchUrl: 'https://www.velp.com/en-ww/search?q={query}',
    productPagePattern: null,
    imageSelector: '.product-image img',
    notes: 'Mixers, stirrers, kjeldahl.',
  },
  Hirschmann: {
    domain: 'www.hirschmann-laborgeraete.de',
    productListUrl: 'https://www.hirschmann-laborgeraete.de/en/products',
    searchUrl: null,
    productPagePattern: null,
    imageSelector: '.product-image img',
    notes: 'Büchner funnels, dispensers.',
  },
  Grant: {
    domain: 'www.grantinstruments.com',
    productListUrl: 'https://www.grantinstruments.com/products/',
    searchUrl: 'https://www.grantinstruments.com/?s={query}',
    productPagePattern: null,
    imageSelector: '.product-image img, .woocommerce-product-gallery img',
    notes: 'Water baths, shakers.',
  },
  'Grant Instruments': {
    domain: 'www.grantinstruments.com',
    productListUrl: 'https://www.grantinstruments.com/products/',
    searchUrl: 'https://www.grantinstruments.com/?s={query}',
    productPagePattern: null,
    imageSelector: '.product-image img, .woocommerce-product-gallery img',
    notes: 'Water baths, shakers.',
  },
  Stuart: {
    domain: 'www.stuart-equipment.com',
    productListUrl: 'https://www.stuart-equipment.com/products/',
    searchUrl: null,
    productPagePattern: null,
    imageSelector: '.product-image img',
    notes: 'Mixers, stirrers, incubators.',
  },
  'Benchmark Scientific': {
    domain: 'www.benchmarkscientific.com',
    productListUrl: 'https://www.benchmarkscientific.com/products/',
    searchUrl: null,
    productPagePattern: null,
    imageSelector: '.product-image img',
    notes: 'Vortex mixers, centrifuges.',
  },
  Julabo: {
    domain: 'www.julabo.com',
    productListUrl: 'https://www.julabo.com/en/products',
    searchUrl: 'https://www.julabo.com/en/search?q={query}',
    productPagePattern: null,
    imageSelector: '.product-image img, .gallery-image img',
    notes: 'Circulators, water baths.',
  },
  Polax: {
    domain: 'www.polax.com.pl',
    productListUrl: 'https://www.polax.com.pl/en/products',
    searchUrl: null,
    productPagePattern: null,
    imageSelector: '.product-image img',
    notes: 'Polax 2L polarimeter (5223). Small Polish manufacturer.',
  },
};

export function getBrandSource(brand: string): BrandSource | null {
  return BRAND_SOURCES[brand] ?? null;
}
