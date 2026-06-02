export interface CategoryMeta {
  slug: string;
  name: string;
  description: string;
  iconName: string;
}

export const categories: CategoryMeta[] = [
  {
    slug: 'glassware-plasticware',
    name: 'Glassware & Plasticware',
    description: 'Beakers, flasks, cylinders, funnels, and durable plastic labware.',
    iconName: 'FlaskConical',
  },
  {
    slug: 'measurement-analysis',
    name: 'Measurement & Analysis',
    description: 'Refractometers, polarimeters, pH meters, and spectrophotometers.',
    iconName: 'Activity',
  },
  {
    slug: 'temperature-control',
    name: 'Temperature Control',
    description: 'Ovens, incubators, water baths, autoclaves, and cooling equipment.',
    iconName: 'Thermometer',
  },
  {
    slug: 'mixing-stirring',
    name: 'Mixing & Stirring',
    description: 'Magnetic stirrers, vortex mixers, overhead stirrers, and homogenisers.',
    iconName: 'Shuffle',
  },
  {
    slug: 'sample-prep',
    name: 'Sample Preparation',
    description: 'Sonicators, filtration, extraction, and grinding equipment.',
    iconName: 'TestTube2',
  },
  {
    slug: 'liquid-handling',
    name: 'Liquid Handling',
    description: 'Pipettes, dispensers, burettes, and peristaltic pumps.',
    iconName: 'Droplets',
  },
  {
    slug: 'consumables-reagents',
    name: 'Consumables & Reagents',
    description: 'Pipette tips, tubes, filters, PPE, and laboratory reagents.',
    iconName: 'Package',
  },
  {
    slug: 'balances-weighing',
    name: 'Balances & Weighing',
    description: 'Analytical, precision, and compact balances with calibration weights.',
    iconName: 'Scale',
  },
  {
    slug: 'evaporation-distillation',
    name: 'Evaporation & Distillation',
    description: 'Rotary evaporators, vacuum pumps, freeze dryers, and distillation sets.',
    iconName: 'Flame',
  },
  {
    slug: 'centrifugation',
    name: 'Centrifugation',
    description: 'Microcentrifuges, bench centrifuges, and refrigerated systems.',
    iconName: 'RefreshCw',
  },
  {
    slug: 'safety-cleanroom',
    name: 'Safety & Cleanroom',
    description: 'Glove boxes, fume hoods, biosafety cabinets, and safety storage.',
    iconName: 'Shield',
  },
  {
    slug: 'quote-required',
    name: 'Quote Required',
    description: 'Specialised and custom items — contact us for pricing.',
    iconName: 'MessageSquare',
  },
];

export const categoryBySlug: Record<string, CategoryMeta> = Object.fromEntries(
  categories.map(c => [c.slug, c])
);
