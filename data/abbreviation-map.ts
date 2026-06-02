// Sage export encoding artifacts — applied before any other normalization
export const SAGE_ENCODING: [string, string][] = [
  ['_AND_', '&'],
  ['_ASTK_', ''],
  // unicode replacement chars in known words
  ['B?chner', 'Büchner'],
  ['0.2?m', '0.2µm'],
];

// Known typos and truncations in the Sage product database
export const TYPO_MAP: [string, string][] = [
  ['Stomaker', 'Stomacher'],
  ['Motar', 'Mortar'],
  ['Timble', 'Thimble'],
  ['Spectrophotometr ', 'Spectrophotometer '],
  ['Refractomete ', 'Refractometer '],
  ['Refractomete\n', 'Refractometer\n'],
  ['Commisioning', 'Commissioning'],
];

// Unit and abbreviation standardization (whole-word context)
export const UNIT_MAP: [RegExp, string][] = [
  [/\bCo2\b/g, 'CO₂'],
  [/\bco2\b/gi, 'CO₂'],
  [/\bUv\b/g, 'UV'],
  [/\bVis\b/g, 'VIS'],
  [/\bPh\b(?=[\s/])/g, 'pH'],
  [/\bMod\b(?=\s+\d)/g, 'Model'],
];
