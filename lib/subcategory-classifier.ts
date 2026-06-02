type SubRule = { terms: string[]; sub: string };

const RULES: Record<string, SubRule[]> = {
  'glassware-plasticware': [
    { terms: ['beaker'], sub: 'Beakers' },
    { terms: ['flask', 'erlenmeyer', 'volumetric flask', 'round bottom', 'flat bottom'], sub: 'Flasks' },
    { terms: ['cylinder', 'measuring cylinder'], sub: 'Measuring Cylinders' },
    { terms: ['funnel', 'buchner', 'büchner', 'separating'], sub: 'Funnels' },
    { terms: ['pipette', 'pipettor', 'pasteur'], sub: 'Pipettes' },
    { terms: ['burette', 'buret'], sub: 'Burettes' },
    { terms: ['bottle', 'winchester', 'reagent bottle', 'nalgene'], sub: 'Bottles & Containers' },
    { terms: ['petri', 'dish', 'watch glass', 'evaporating dish', 'crystallising'], sub: 'Dishes & Plates' },
    { terms: ['test tube', 'centrifuge tube', 'falcon', 'microcentrifuge', '1.5ml', '2ml tube'], sub: 'Tubes & Vials' },
    { terms: ['condenser', 'liebig', 'reflux'], sub: 'Condensers' },
    { terms: ['stopper', 'bung', 'septum', 'cap'], sub: 'Stoppers & Caps' },
    { terms: ['spatula', 'spoon', 'weighing boat'], sub: 'Utensils' },
  ],
  'temperature-control': [
    { terms: ['hot plate', 'hotplate', 'heating plate'], sub: 'Hot Plates' },
    { terms: ['magnetic stir', 'stirring hotplate', 'stirrer hotplate', 'stir plate'], sub: 'Hot Plates & Stirrers' },
    { terms: ['water bath', 'waterbath', 'shaking bath'], sub: 'Water Baths' },
    { terms: ['oven', 'drying oven', 'forced air', 'convection'], sub: 'Ovens & Dryers' },
    { terms: ['incubator', 'co2 incubator', 'co₂ incubator'], sub: 'Incubators' },
    { terms: ['autoclave', 'sterilizer', 'steam steriliz'], sub: 'Autoclaves & Sterilizers' },
    { terms: ['freezer', 'ultralow', 'ultra-low', '-86', '-80'], sub: 'Freezers' },
    { terms: ['refrigerator', 'fridge', 'cooling cabinet'], sub: 'Refrigerators' },
    { terms: ['heat block', 'dry bath', 'heating block', 'thermoblock'], sub: 'Heat Blocks' },
    { terms: ['thermometer', 'thermocouple', 'temperature probe', 'temperature logger'], sub: 'Thermometers & Probes' },
    { terms: ['muffle furnace', 'furnace'], sub: 'Furnaces' },
  ],
  'measurement-analysis': [
    { terms: ['refractometer'], sub: 'Refractometers' },
    { terms: ['polarimeter'], sub: 'Polarimeters' },
    { terms: ['spectrophotometer', 'spectro', 'uv/vis', 'uvvis', 'colorimeter', 'colour assessment'], sub: 'Spectrophotometers' },
    { terms: ['ph meter', 'ph electrode', 'electrode', 'ph/temp', 'ion meter'], sub: 'pH & Electrochemistry' },
    { terms: ['microscope', 'microscopy'], sub: 'Microscopes' },
    { terms: ['viscometer', 'viscosity', 'ford cup', 'flow timer'], sub: 'Viscometers' },
    { terms: ['conductivity', 'conductometer'], sub: 'Conductivity Meters' },
    { terms: ['dissolved oxygen', 'do meter'], sub: 'Dissolved Oxygen' },
    { terms: ['moisture', 'moisture analyser', 'moisture balance'], sub: 'Moisture Analysers' },
    { terms: ['timer', 'clock', 'stopwatch'], sub: 'Timers' },
    { terms: ['hygrometer', 'humidity'], sub: 'Hygrometers' },
  ],
  'mixing-stirring': [
    { terms: ['magnetic stir', 'magnetic stirrer', 'mag stir'], sub: 'Magnetic Stirrers' },
    { terms: ['vortex'], sub: 'Vortex Mixers' },
    { terms: ['overhead stir', 'overhead mixer', 'propeller', 'paddle'], sub: 'Overhead Stirrers' },
    { terms: ['shaker', 'orbital shaker', 'wrist action', 'rocking'], sub: 'Shakers' },
    { terms: ['homogenizer', 'homogeniser', 'stomacher', 'bag mixer', 'blender'], sub: 'Homogenizers & Blenders' },
    { terms: ['rotator', 'tube rotator', 'roller', 'wheel'], sub: 'Rotators & Rollers' },
    { terms: ['disperser', 'ultra-turrax', 'turrax'], sub: 'Dispersers' },
  ],
  'sample-prep': [
    { terms: ['ultrasonic', 'sonicator', 'sonication', 'sonic bath'], sub: 'Sonicators & Ultrasonic Baths' },
    { terms: ['filter', 'filtration', 'membrane filter', 'syringe filter'], sub: 'Filtration' },
    { terms: ['soxhlet', 'extractor', 'thimble'], sub: 'Extraction' },
    { terms: ['mortar', 'pestle', 'grinding'], sub: 'Grinding & Milling' },
    { terms: ['microwave', 'digestion'], sub: 'Digestion' },
    { terms: ['colony counter', 'colony'], sub: 'Colony Counters' },
    { terms: ['cell disrupt', 'bead mill'], sub: 'Cell Disruption' },
  ],
  'liquid-handling': [
    { terms: ['pipette', 'pipettor', 'micropipette', 'single channel', 'multichannel'], sub: 'Pipettes' },
    { terms: ['pipette controller', 'pipette boy', 'accu-jet'], sub: 'Pipette Controllers' },
    { terms: ['dispenser', 'bottle-top dispenser', 'repeater'], sub: 'Dispensers' },
    { terms: ['burette', 'buret', 'autom buret'], sub: 'Burettes' },
    { terms: ['pump', 'peristaltic', 'tubing pump'], sub: 'Pumps & Tubing' },
    { terms: ['tip', 'pipette tip'], sub: 'Pipette Tips' },
  ],
  'consumables-reagents': [
    { terms: ['tip', 'pipette tip', 'combitip'], sub: 'Pipette Tips' },
    { terms: ['tube', 'eppendorf tube', 'microcentrifuge tube', 'falcon'], sub: 'Tubes & Vials' },
    { terms: ['filter paper', 'filter membrane', 'cellulose', 'filter', 'membrane'], sub: 'Filters & Membranes' },
    { terms: ['glove', 'gloves', 'ppe', 'safety'], sub: 'PPE & Safety' },
    { terms: ['reagent', 'chemical', 'stain', 'dye', 'solution'], sub: 'Reagents & Chemicals' },
    { terms: ['tape', 'label', 'marker', 'pen'], sub: 'Labelling & Markers' },
    { terms: ['bag', 'stomacher bag', 'sample bag'], sub: 'Sample Bags' },
    { terms: ['plate', 'microplate', 'well plate', 'pcr plate'], sub: 'Plates & Microplates' },
  ],
  'balances-weighing': [
    { terms: ['analytical balance', 'analytical'], sub: 'Analytical Balances' },
    { terms: ['precision balance', 'semi-micro'], sub: 'Precision Balances' },
    { terms: ['top-loading', 'top loading', 'bench scale', 'compact balance'], sub: 'Compact Balances' },
    { terms: ['moisture'], sub: 'Moisture Analysers' },
    { terms: ['weight', 'weights', 'calibration weight'], sub: 'Weights & Calibration' },
    { terms: ['draft shield'], sub: 'Accessories' },
  ],
  'evaporation-distillation': [
    { terms: ['rotary evaporat', 'rotovap', 'rotavap', 'rota vapor'], sub: 'Rotary Evaporators' },
    { terms: ['vacuum pump', 'pump'], sub: 'Vacuum Pumps' },
    { terms: ['freeze dry', 'lyophiliz', 'lyophiliser', 'lyophilizer'], sub: 'Freeze Dryers' },
    { terms: ['distillation', 'still', 'kjeldahl'], sub: 'Distillation' },
    { terms: ['concentrator', 'speed vac'], sub: 'Concentrators' },
  ],
  'centrifugation': [
    { terms: ['microcentrifuge', 'microfuge', '1.5 ml', '2ml centrifuge'], sub: 'Microcentrifuges' },
    { terms: ['benchtop centrifuge', 'bench centrifuge', 'clinical centrifuge'], sub: 'Bench Centrifuges' },
    { terms: ['high speed', 'refrigerated centrifuge'], sub: 'Refrigerated Centrifuges' },
    { terms: ['rotor', 'centrifuge rotor', 'swinging bucket'], sub: 'Rotors & Accessories' },
  ],
  'safety-cleanroom': [
    { terms: ['fume hood', 'fume cupboard', 'ductless hood'], sub: 'Fume Hoods' },
    { terms: ['biosafety cabinet', 'laminar flow', 'clean bench'], sub: 'Biosafety Cabinets' },
    { terms: ['glove box', 'glovebox', 'anaerobic'], sub: 'Glove Boxes' },
    { terms: ['safety cabinet', 'flammable cabinet', 'chemical storage'], sub: 'Safety Cabinets' },
    { terms: ['eye wash', 'emergency shower', 'first aid'], sub: 'Emergency Equipment' },
    { terms: ['colour assessment', 'colour cabinet', 'light box'], sub: 'Colour Assessment' },
  ],
};

export function classifySubcategory(categorySlug: string, description: string): string | null {
  const rules = RULES[categorySlug];
  if (!rules) return null;

  const lower = description.toLowerCase();
  for (const rule of rules) {
    if (rule.terms.some(term => lower.includes(term))) {
      return rule.sub;
    }
  }

  return null;
}
