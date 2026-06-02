export interface ProductCategory {
  slug: string;
  name: string;
  description: string;
  image: string; /* TODO: Replace with real Labex product imagery */
  subcategories: string[];
}

export const productCategories: ProductCategory[] = [
  {
    slug: "balances-weighing",
    name: "Balances & Weighing",
    description: "Analytical, precision, and industrial balances from Sartorius, BRAND, and more.",
    image: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&q=80",
    subcategories: ["Analytical balances", "Precision balances", "Industrial balances", "Moisture analysers"],
  },
  {
    slug: "mixing-stirring",
    name: "Mixing & Stirring",
    description: "Overhead stirrers, magnetic stirrers, vortex mixers, and homogenisers from Heidolph and IKA.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",
    subcategories: ["Overhead stirrers", "Magnetic stirrers", "Vortex mixers", "Homogenisers"],
  },
  {
    slug: "evaporation-distillation",
    name: "Evaporation & Distillation",
    description: "Rotary evaporators, vacuum systems, and distillation apparatus from Heidolph.",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80",
    subcategories: ["Rotary evaporators", "Vacuum pumps", "Distillation sets", "Condensers"],
  },
  {
    slug: "glassware-plasticware",
    name: "Glassware & Plasticware",
    description: "DURAN, WHEATON, and KIMBLE glass plus plasticware for every laboratory application.",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
    subcategories: ["Borosilicate glass", "Volumetric glassware", "Plasticware", "Storage bottles"],
  },
  {
    slug: "liquid-handling",
    name: "Liquid Handling",
    description: "Pipettes, dispensers, burettes, and automated liquid handling from BRAND and Cole-Parmer.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
    subcategories: ["Pipettes", "Dispensers", "Burettes", "Peristaltic pumps"],
  },
  {
    slug: "temperature-control",
    name: "Temperature Control",
    description: "Incubators, refrigerators, ovens, and water baths from Isotherm and Thermo Scientific.",
    image: "https://images.unsplash.com/photo-1581093057519-e3a28e02ccc3?w=800&q=80",
    subcategories: ["Laboratory incubators", "Refrigerators & freezers", "Ovens", "Water baths"],
  },
];
