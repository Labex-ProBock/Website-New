export interface EquipmentItem {
  name: string;
  description?: string;
}

export interface Industry {
  slug: string;
  name: string;
  shortName: string;
  headline: string;
  description: string;
  applications: string[];
  image: string;
  color: string;
  intro?: string;
  closing?: string;
  equipment?: EquipmentItem[];
}

const ALL_INDUSTRIES: Industry[] = [
  {
    slug: "research",
    name: "Research",
    shortName: "Research",
    headline: "Precision instruments for university and postgraduate laboratories",
    description:
      "Labex supplies a comprehensive selection of research laboratory equipment to universities, research institutes, and the broader scientific community across Sub-Saharan Africa — from basic analytical tools to advanced instrumentation.",
    applications: [
      "Analytical chemistry",
      "PCR & molecular biology",
      "Spectroscopy",
      "Chromatography systems",
    ],
    image: "/industries/academic.jpg",
    color: "#FF6A1A",
    intro:
      "Labex offers a comprehensive selection of academic and research laboratory equipment designed to meet the diverse needs of educational institutions, research facilities, and the broader scientific community across Sub-Saharan Africa.",
    equipment: [
      { name: "Air purifiers and samplers" },
      { name: "Autoclaves and sterilisers" },
      { name: "Balances and scales" },
      { name: "Baths and circulators" },
      { name: "Centrifuges and shakers" },
      { name: "Climatic chambers and incubators" },
      { name: "Density meters and viscometers" },
      { name: "Desiccators and drying ovens" },
      { name: "Electrochemical meters" },
      { name: "Filtration systems and extractors" },
      { name: "Furnaces and ovens" },
      { name: "Gas analysers and generators" },
      { name: "Hotplates and stirrers" },
      { name: "Kjeldahl systems" },
      { name: "Laminar flow cabinets" },
      { name: "Microscopes and imaging systems" },
      { name: "Mills and mixers" },
      { name: "PCR thermal cyclers" },
      { name: "Photometers and spectrophotometers" },
      { name: "Polarimeters and refractometers" },
      { name: "Reactors and fermenters" },
      { name: "Rotary evaporators" },
      { name: "Sample preparation equipment" },
      { name: "Spectroscopes and spectrometers" },
      { name: "Turbidimeters and colorimeters" },
      { name: "Ultrasonic baths and cleaners" },
      { name: "Water purification systems" },
    ],
  },
  {
    slug: "pharmaceutical",
    name: "Pharmaceutical",
    shortName: "Pharma",
    headline: "GMP-compliant equipment for South Africa's pharmaceutical manufacturers",
    description:
      "Labex is a trusted partner for pharmaceutical research and manufacturing — supplying precision instruments that meet the strict analytical demands of formulation, stability testing, and quality control in regulated environments.",
    applications: [
      "Dissolution testing",
      "Stability chambers",
      "Particle size analysis",
      "Sterility testing",
    ],
    image: "/industries/pharma.jpg",
    color: "#FF6A1A",
    intro:
      "At Labex, we are your trusted partner in the fields of pharmaceutical research and manufacturing, offering a comprehensive range of cutting-edge laboratory equipment designed for accurate analyses essential to product innovation and regulatory compliance.",
    closing:
      "Labex is dedicated to providing high-quality laboratory equipment coupled with exceptional customer service to support research and development objectives in pharmaceutical product compliance.",
    equipment: [
      {
        name: "Dissolution Testers",
        description:
          "Precisely measure the dissolution rate of solid dosage forms to ensure product quality, efficacy, and bioavailability.",
      },
      {
        name: "Gel Permeation Chromatographs (GPC)",
        description:
          "Analyse molecular weight distribution and polymer composition, critical for formulation development and quality control.",
      },
      {
        name: "Kjeldahl Method Equipment",
        description:
          "Accurately determine nitrogen content for protein analysis across raw materials and finished products.",
      },
      {
        name: "Particle Size Analysers",
        description:
          "Measure particle size distribution to understand physical properties affecting formulation stability and performance.",
      },
      {
        name: "Stability Chambers",
        description:
          "Simulate environmental conditions to assess product shelf life, stability, and storage requirements.",
      },
      {
        name: "Sterility Testers",
        description:
          "Verify microbial purity to ensure safety and compliance with pharmaceutical standards.",
      },
      {
        name: "Tablet Hardness Testers",
        description:
          "Evaluate the mechanical strength and durability of solid dosage forms to guarantee consistent product performance.",
      },
    ],
  },
  {
    slug: "chemical",
    name: "Chemical/Petrochemical",
    shortName: "Chemical",
    headline: "High-precision instrumentation for industrial chemistry and polymer QC",
    description:
      "Labex is a trusted supplier of high-quality chemical testing equipment designed to meet the rigorous demands of industrial chemistry, polymer analysis, and petrochemical quality control.",
    applications: [
      "HPLC & GC systems",
      "Spectrophotometry",
      "Titration & distillation",
      "Particle analysis",
    ],
    image: "/industries/chemical.jpg",
    color: "#E04E00",
    intro:
      "Labex is a trusted supplier of high-quality chemical testing equipment, specifically designed to meet the rigorous demands of scientific laboratories, industrial chemistry operations, and academic research institutions.",
    closing:
      "At Labex, we understand the importance of accuracy, reliability, and efficiency in chemical and biomedical research.",
    equipment: [
      {
        name: "Atomic Absorption Spectrophotometers",
        description: "Accurate quantification of trace elements in diverse samples.",
      },
      { name: "Chemical Reactors", description: "Safe and efficient systems for controlled chemical processes." },
      {
        name: "Chromatography Systems",
        description: "Advanced solutions for separation and quantification of complex compounds.",
      },
      { name: "Element Analysis Equipment", description: "High-precision instruments for detailed elemental profiling." },
      { name: "Flame Photometers", description: "Reliable tools for measuring alkali and alkaline earth metals." },
      {
        name: "FTIR Spectrometers",
        description: "Identification of organic and inorganic compounds using infrared spectroscopy.",
      },
      {
        name: "Gas Chromatographs",
        description: "Analytical systems for detecting volatile and semi-volatile substances.",
      },
      { name: "HPLC Systems", description: "High-performance chromatography tools for chemical substance analysis." },
      { name: "Refractometers", description: "Instruments for measuring refractive index in chemical samples." },
      { name: "Rheometers", description: "Characterisation of material viscosity and flow properties." },
      { name: "Titrators", description: "Automated systems for quantitative chemical composition analysis." },
      { name: "Autoclaves", description: "Essential for sterilising laboratory instruments and materials." },
      { name: "Calorimeters", description: "Measuring heat flow and thermal properties of substances." },
      {
        name: "Centrifuges",
        description: "Efficient separation of sample components through high-speed spinning.",
      },
      {
        name: "Conductivity & TDS Meters",
        description: "Monitoring electrical conductivity and dissolved solids in solutions.",
      },
      { name: "Filtration Systems", description: "Advanced liquid and gas purification for laboratory processes." },
      { name: "Gas Analysers", description: "Monitoring and analysing gas compositions in research environments." },
      { name: "Gas Generators", description: "On-site production of pure gases for uninterrupted lab operations." },
      { name: "Magnetic Stirrers & Hot Plates", description: "For uniform sample mixing and temperature control." },
      { name: "Microscopes", description: "Optical and electron solutions for micro and nano-scale research." },
      { name: "Particle Analysers", description: "Analysis of particle size, distribution, and morphology." },
      {
        name: "pH Meters",
        description: "Accurate acidity/alkalinity measurement for chemical and biological research.",
      },
      { name: "Polarimeters", description: "Measurement of optical rotation for chiral compound analysis." },
      {
        name: "Solvent Extractors & Soxhlet Systems",
        description: "Effective analyte extraction from complex matrices.",
      },
      { name: "Turbidimeters", description: "Turbidity analysis for water and environmental monitoring." },
      { name: "Water Baths", description: "Stable temperature environments for incubation and chemical reactions." },
    ],
  },
  {
    slug: "education",
    name: "Education",
    shortName: "Education",
    headline: "Reliable, budget-conscious equipment for schools and teaching laboratories",
    description:
      "Labex equips schools, technical colleges, and university teaching laboratories across South Africa with reliable, durable instruments that support the full school and tertiary curriculum — from introductory titration to advanced spectroscopy.",
    applications: [
      "Balances & scales",
      "pH meters & titration",
      "Microscopes",
      "Centrifuges",
    ],
    image: "/industries/academic.jpg",
    color: "#FF6A1A",
    intro:
      "Labex offers a comprehensive selection of educational laboratory equipment designed to meet the diverse needs of schools, technical colleges, and university teaching facilities — from basic lab supplies to instruments that support advanced coursework.",
    equipment: [
      { name: "Balances and scales" },
      { name: "Centrifuges" },
      { name: "Drying ovens" },
      { name: "Electrochemical meters (pH, conductivity)" },
      { name: "Filtration systems" },
      { name: "Hotplates and stirrers" },
      { name: "Laminar flow cabinets" },
      { name: "Microscopes" },
      { name: "PCR thermal cyclers" },
      { name: "Spectrophotometers" },
      { name: "Titration equipment" },
      { name: "Turbidimeters" },
      { name: "Water purification systems" },
      { name: "Water baths" },
    ],
  },
  {
    slug: "food-beverage",
    name: "Food and Beverage",
    shortName: "Food & Bev",
    headline: "Compliance-ready equipment for breweries, dairy, and processed-food labs",
    description:
      "Labex supports quality assurance professionals and researchers in the food and beverage industry with a comprehensive range of specialised laboratory equipment for compliance testing, safety analysis, and product development.",
    applications: [
      "Moisture analysis",
      "pH & refractometry",
      "Microbiological testing",
      "Food & milk analysers",
    ],
    image: "/industries/food.jpg",
    color: "#FF6A1A",
    intro:
      "At Labex, we proudly support quality assurance professionals in the food and beverage industry with a comprehensive range of specialised laboratory equipment.",
    equipment: [
      { name: "Autoclaves", description: "Reliable sterilisation of lab instruments and materials." },
      {
        name: "Bacteria Analysis & Testing Equipment",
        description: "Accurate detection and identification of microbial contaminants.",
      },
      { name: "Density Meters", description: "Precise measurement of product density for quality control." },
      { name: "Food & Milk Analysers", description: "In-depth analysis of composition and nutritional content." },
      { name: "Moisture Analysers", description: "Determine moisture content in solids, powders, and liquids." },
      { name: "pH Meters", description: "Monitor acidity and alkalinity with laboratory-grade precision." },
      {
        name: "Refractometers",
        description: "Analyse the refractive index of liquids to determine concentration and purity.",
      },
      { name: "Gas Analysers", description: "Real-time monitoring of gas concentrations in processing environments." },
      { name: "Gas Generators", description: "On-site production of high-purity gases to support lab equipment." },
      { name: "Incubators", description: "Maintain ideal growth conditions for microbial and stability testing." },
      { name: "Laboratory Ovens", description: "Precise temperature control for drying, baking, and heat treatments." },
      { name: "Water Baths", description: "Consistent temperature regulation for sample incubation and testing." },
      { name: "Water Purification Systems", description: "Ensure clean, high-quality water for lab procedures." },
      {
        name: "Kjeldahl Method Apparatus",
        description: "Accurate nitrogen and protein determination for food analysis.",
      },
      {
        name: "Sample Preparation Equipment",
        description: "Tools for efficient handling, homogenising, and processing of samples.",
      },
    ],
  },
  {
    slug: "automotive",
    name: "Automotive",
    shortName: "Automotive",
    headline: "Materials, fluids, and emissions testing for automotive manufacturing and R&D",
    description:
      "Labex equips automotive manufacturers, component suppliers, and testing facilities with instruments for materials characterisation, lubricant and fluid analysis, coatings inspection, and emissions testing across the production line and R&D laboratory.",
    applications: [
      "Materials & coatings testing",
      "Lubricant & fluid analysis",
      "Hardness & wear testing",
      "Emissions analysis",
    ],
    image: "/industries/automotive.jpg",
    color: "#FF6A1A",
    intro:
      "Labex supports the automotive sector with a comprehensive range of laboratory equipment for quality control and research — from incoming materials inspection to finished-component validation and fluid analysis.",
  },
  {
    slug: "water-environmental",
    name: "Water/Environmental",
    shortName: "Water & Env",
    headline: "Monitoring and analysis instruments for water quality and environmental compliance",
    description:
      "Labex supplies municipalities, environmental laboratories, and industrial water teams with instruments for water quality monitoring, effluent analysis, and environmental compliance testing across both field and laboratory applications.",
    applications: [
      "Water quality monitoring",
      "Turbidity & photometry",
      "pH, conductivity & DO",
      "Effluent & sample testing",
    ],
    image: "/industries/environment.jpg",
    color: "#FF6A1A",
    intro:
      "Labex provides a comprehensive selection of water and environmental testing equipment — supporting accurate monitoring of water quality, effluent, and environmental parameters for regulatory compliance and public health.",
  },
  {
    slug: "mining",
    name: "Mining",
    shortName: "Mining",
    headline: "Robust sample-prep and analytical instruments for mining and metallurgy",
    description:
      "Labex supplies the mining and minerals sector with durable laboratory equipment for sample preparation, assaying, and metallurgical analysis — engineered to withstand demanding ore, slurry, and process-control workloads.",
    applications: [
      "Sample preparation",
      "Assaying & furnaces",
      "Moisture & density analysis",
      "Particle sizing",
    ],
    image: "/industries/mining.jpg",
    color: "#FF6A1A",
    intro:
      "Labex equips mining and metallurgical laboratories with robust instruments for sample preparation, assaying, and process control — built for the throughput and durability the sector demands.",
  },
  {
    slug: "life-sciences",
    name: "Life Sciences",
    shortName: "Life Sciences",
    headline: "Precision instruments for molecular biology, clinical, and biotech laboratories",
    description:
      "Labex supports life science researchers, clinical laboratories, and biotech facilities with precision instruments for molecular biology, cell culture, sample storage, and analytical workflows.",
    applications: [
      "PCR & molecular biology",
      "Centrifugation",
      "Cold storage & cryogenics",
      "Microscopy & imaging",
    ],
    image: "/industries/clinical.jpg",
    color: "#FF6A1A",
    intro:
      "Labex offers a comprehensive range of life science laboratory equipment — supporting molecular biology, clinical diagnostics, and biotechnology research with reliable, precise instrumentation and full technical support.",
  },
  {
    slug: "agriculture",
    name: "Agriculture",
    shortName: "Agriculture",
    headline: "Soil, plant, and feed analysis instruments for agricultural laboratories",
    description:
      "Labex equips agricultural laboratories, agronomists, and research stations with instruments for soil, plant, water, and feed analysis — supporting crop science, fertiliser management, and food-security research across Southern Africa.",
    applications: [
      "Soil & plant analysis",
      "Kjeldahl nitrogen",
      "Moisture analysis",
      "Water & nutrient testing",
    ],
    image: "/industries/agriculture.jpg",
    color: "#FF6A1A",
    intro:
      "Labex provides a comprehensive selection of agricultural laboratory equipment — supporting soil, plant, feed, and water analysis for agronomy, crop science, and agricultural research.",
  },
];

// Client-confirmed sector set + display order (overrides the legacy six).
const INDUSTRY_ORDER = [
  "automotive",
  "water-environmental",
  "pharmaceutical",
  "mining",
  "life-sciences",
  "education",
  "research",
  "agriculture",
  "food-beverage",
  "chemical",
] as const;

export const industries: Industry[] = INDUSTRY_ORDER.map((slug) => {
  const found = ALL_INDUSTRIES.find((i) => i.slug === slug);
  if (!found) throw new Error(`industries: missing entry for "${slug}"`);
  return found;
});
