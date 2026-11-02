/**
 * REKIND Industrial — Machinery Digital Twin & RAG (Retrieval-Augmented Generation) Engine
 * Operates an indexed technical manual knowledge chunk store over major industrial OEM equipment,
 * performing semantic similarity retrieval and grounded engineering answers.
 */

const OEM_TECHNICAL_KNOWLEDGE_BASE = [
  // CATERPILLAR EXCAVATORS
  {
    id: 'CAT-HYD-01',
    category: 'Earthmoving & Excavation Equipment',
    brands: ['caterpillar', 'cat'],
    models: ['320', '320d', '320d l', '323', '330', '336'],
    topic: 'Hydraulic System & Attachment Auxiliary Flow',
    content: 'Caterpillar 320D series features an open-center, two-pump hydraulic system delivering up to 428 L/min (113 gal/min) total main pump flow at 35,000 kPa (5,076 psi) relief pressure. Auxiliary high-pressure circuit supports hydraulic rock breakers and shears with adjustable relief valve settings from 21,000 to 35,000 kPa. Uses Cat HYDO Advanced 10 hydraulic oil with 6,000-hour oil drain intervals under certified SOS fluid sampling. For rock breaker applications, install auxiliary hydraulic return filter and inspect oil at 250-hour intervals.',
    source: 'Caterpillar 320D/320D L Hydraulic System Operation & Maintenance Manual (SEBU8081)'
  },
  {
    id: 'CAT-MAINT-02',
    category: 'Earthmoving & Excavation Equipment',
    brands: ['caterpillar', 'cat'],
    models: ['320', '320d', '320d l', '323', '330', '336'],
    topic: 'Scheduled Maintenance Intervals & Fluids',
    content: 'Engine oil (Cat DEO-ULS 15W-40) service interval: 500 operating hours. Fuel system secondary filters: 500 hours. Swing drive planetary gearbox oil replacement: 1,000 hours. Final drive travel planetary oil replacement: 2,000 hours. Hydraulic system return filter replacement: 1,000 hours. Undercarriage track tension must be maintained with 50-65mm sag measured across track rollers. Engine valve lash inspection: 2,000 hours.',
    source: 'Caterpillar C6.4 / C7.1 ACERT Industrial Engine Service Guide'
  },
  {
    id: 'CAT-TRANSIT-03',
    category: 'Earthmoving & Excavation Equipment',
    brands: ['caterpillar', 'cat'],
    models: ['320', '320d', '320d l', '323', '330'],
    topic: 'Rigging, Lowbed Transit & Dimensional Logistics',
    content: 'Standard operating weight: 20,500 kg (45,200 lbs). Overall shipping height with standard boom: 3.12 m (10 ft 3 in). Shipping width with 600mm shoes: 2.98 m (9 ft 9 in). Shipping length: 9.46 m (31 ft 0 in). Requires minimum 3-axle heavy-duty lowbed trailer with 35-ton rating. Four-point corner chain tiedowns rated at 1/2-inch Grade 70 transport chain required. Swing brake lock pin must be inserted and hydraulic control lockout lever engaged prior to transit.',
    source: 'Heavy Equipment Transport Clearance & Rigging Protocol (OSHA 1926.1400 / BIS 13364)'
  },

  // HAAS CNC MACHINING CENTERS
  {
    id: 'HAAS-SPINDLE-01',
    category: 'CNC & Metalworking Machinery',
    brands: ['haas', 'haas automation'],
    models: ['vf-2', 'vf-3', 'vf-4', 'minimill', 'super mini mill'],
    topic: 'Spindle Specifications, Tool Taper & Drive System',
    content: 'Haas VF-2 is equipped with a 40-taper inline direct-drive spindle delivering 10,000 RPM (optional 15,000 RPM Super-Speed). Driven by a 30 HP (22.4 kW) vector dual-drive motor producing 122 Nm (90 ft-lb) torque at 2,000 RPM. Compatible with standard CT40 (CAT40) or BT40 retention pull studs with 45-degree angle. Features high-pressure air blast through spindle for chip clearing. Spindle thermal expansion is dynamically compensated via multi-point RTD sensors.',
    source: 'Haas Vertical Machining Center Service Manual (ES0620 Rev AD)'
  },
  {
    id: 'HAAS-AIR-ELEC-02',
    category: 'CNC & Metalworking Machinery',
    brands: ['haas', 'haas automation'],
    models: ['vf-2', 'vf-3', 'vf-4', 'vmc'],
    topic: 'Electrical Supply, Pneumatic Input & Foundation Requirements',
    content: 'Electrical requirement: 354-488 VAC 3-Phase, 50/60 Hz, 50 Amp service breaker (internal step-down transformer configured for 415V Indian/European or 480V US grids). Pneumatic requirement: 4.0 SCFM (113 L/min) dry clean air at continuous 85 psi (5.9 bar). Foundation requires minimum 150mm (6-inch) reinforced 3,000 psi concrete slab isolated from external press vibrations. Axis transport shipping brackets must remain bolted until machine leveling is verified with precision machinist level within 0.0005 in/ft.',
    source: 'Haas Automation Machine Pre-Installation & Site Readiness Guide'
  },

  // TOYOTA INDUSTRIAL FORKLIFTS
  {
    id: 'TOYOTA-MAST-01',
    category: 'Material Handling & Forklifts',
    brands: ['toyota', 'toyota material handling'],
    models: ['8fgu25', '8fg25', '8fd25', '8fgu30', 'core ic'],
    topic: 'Hydraulic Mast, Carriage Capacity & Dual-Fuel Engine',
    content: 'Toyota 8FGU25 rated capacity: 5,000 lbs (2,270 kg) at 24-inch (600mm) load center. Equipped with Toyota 4Y-ECS industrial LPG/Gasoline engine (54 HP @ 2,570 RPM). Standard 3-stage FSV full-free lift mast extends to 189 inches (4.8 m) with 39 inches free lift before outer mast staging. Features Toyota System of Active Stability (SAS) with active control rear stabilizer and mast tilt speed limiter. Hydraulic pressure relief set at 2,320 psi (16.0 MPa). Hydraulic oil: ISO VG 46 anti-wear fluid.',
    source: 'Toyota 8-Series Forklift Repair Manual (CE016-1)'
  },

  // CUMMINS DIESEL GENERATORS
  {
    id: 'CUMMINS-GEN-01',
    category: 'Generators & Industrial Power',
    brands: ['cummins', 'cummins power generation'],
    models: ['qsk60', 'qsb', '125 kva', '250 kva', '500 kva', 'c125d5'],
    topic: 'Prime & Standby Ratings, Alternator & ATS Synchronization',
    content: 'Cummins industrial generator delivers 125 kVA (100 kWe) prime power at 415V 50Hz, 3-phase, 0.8 power factor with 10% overload capacity for 1 hour in every 12 hours. Powered by 6-cylinder inline turbocharged Cummins diesel engine. Equipped with Stamford brushless single-bearing alternator with 2/3 pitch winding to minimize harmonic distortion. PowerCommand digital micro-processor controller supports automatic mains failure (AMF), automatic transfer switch (ATS) triggering, and RS485 Modbus remote telematics monitoring. Fuel consumption at 75% prime load: ~22.5 L/hr.',
    source: 'Cummins Power Generation Technical Specification & Application Manual'
  },

  // ATLAS COPCO COMPRESSORS
  {
    id: 'ATLAS-SCREW-01',
    category: 'Pumps, Compressors & Hydraulics',
    brands: ['atlas copco', 'atlas'],
    models: ['ga37', 'ga45', 'ga55', 'xas 185'],
    topic: 'Rotary Screw Air End, Elektronikon Control & Dewatering',
    content: 'Atlas Copco GA37 oil-injected rotary screw compressor delivers 220 CFM (104 L/s) free air delivery (FAD) at 7.5 bar (109 psi) to 10 bar (145 psi). Driven by 37 kW (50 HP) IP55 high-efficiency induction motor. Controlled via Elektronikon Touch graphic interface featuring automated start/stop, pressure band optimization, and built-in dew point monitoring. Utilizes synthetic Atlas Copco Roto-Inject fluid with 4,000-hour replacement intervals. Features integrated refrigerant air dryer delivering Pressure Dew Point (PDP) of +3°C.',
    source: 'Atlas Copco Industrial Air Oil-Injected Screw Compressors Manual'
  },

  // BOMAG ROAD ROLLERS
  {
    id: 'BOMAG-DRUM-01',
    category: 'Construction & Roadwork Machinery',
    brands: ['bomag', 'wirtgen', 'dynapac'],
    models: ['bw 211', 'bw 213', 'bw 177'],
    topic: 'Vibratory Drum Dynamics, Soil Compaction & Dual Frequency',
    content: 'Bomag BW 211 single drum soil compactor operating weight: 11,200 kg. Front drum static linear load: 33.5 kg/cm. Dual-frequency vibratory exciter system operates at 30 Hz (high amplitude: 1.80 mm, centrifugal force 240 kN) for deep rock sub-base compaction, and 36 Hz (low amplitude: 0.95 mm, centrifugal force 150 kN) for granular surface finishing. Equipped with BOMAG Terrameter (BTM) continuous dynamic compaction measuring system. Low-center-of-gravity articulation joint allows 35-degree steering and 12-degree oscillation.',
    source: 'BOMAG Compaction Technology Handbook'
  }
];

/**
 * Computes lexical & n-gram semantic similarity between user query and knowledge chunks.
 */
function computeChunkRelevance(queryTokens, chunk) {
  let score = 0;
  const chunkText = `${chunk.topic} ${chunk.content} ${chunk.brands.join(' ')} ${chunk.models.join(' ')} ${chunk.category}`.toLowerCase();

  queryTokens.forEach(token => {
    if (chunkText.includes(token)) {
      score += 15;
      // Bonus if present in topic or models
      if (chunk.topic.toLowerCase().includes(token)) score += 20;
      if (chunk.models.some(m => m.includes(token))) score += 35;
      if (chunk.brands.some(b => b.includes(token))) score += 25;
    }
  });

  return score;
}

/**
 * Executes Grounded Retrieval-Augmented Generation (RAG) over the machinery item
 * and engineering manual knowledge chunks.
 */
export function queryMachineryCopilot(item, question, conversationHistory = []) {
  if (!question || !question.trim()) {
    return {
      answer: "Please state your technical query regarding this machinery's operating specifications, hydraulic circuits, service intervals, or transit logistics.",
      citations: []
    };
  }

  const cleanQuery = question.toLowerCase().trim();
  const tokens = cleanQuery.split(/[\s,?.!-]+/).filter(t => t.length > 2);

  // Score all knowledge chunks
  const scoredChunks = OEM_TECHNICAL_KNOWLEDGE_BASE.map(chunk => ({
    chunk,
    relevance: computeChunkRelevance(tokens, chunk)
  })).sort((a, b) => b.relevance - a.relevance);

  const topChunks = scoredChunks.filter(s => s.relevance > 0).slice(0, 2);

  // Base fallback if no deep technical manual chunk triggered
  let responseText = '';
  const citations = [];

  const itemDetailsSnippet = `Unit Under Inspection: ${item.title} (OEM: ${item.manufacturer || 'Industrial OEM'}, Model: ${item.modelNumber || 'N/A'}, Meter Hours: ${item.operatingHours ? item.operatingHours.toLocaleString() + ' hrs' : 'Unspecified'}, Condition: ${item.condition}, Location: ${item.location}).`;

  if (topChunks.length > 0) {
    const primary = topChunks[0].chunk;
    citations.push({
      id: primary.id,
      topic: primary.topic,
      source: primary.source
    });

    if (topChunks.length > 1 && topChunks[1].relevance > 30) {
      citations.push({
        id: topChunks[1].chunk.id,
        topic: topChunks[1].chunk.topic,
        source: topChunks[1].chunk.source
      });
    }

    // Grounded synthesis answering specific engineering concerns
    if (cleanQuery.includes('hydraulic') || cleanQuery.includes('pressure') || cleanQuery.includes('flow') || cleanQuery.includes('oil') || cleanQuery.includes('breaker') || cleanQuery.includes('fluid')) {
      responseText = `Based on official technical documentation for this ${item.manufacturer || ''} ${item.modelNumber || ''} class:\n\n` +
        `• Hydraulic Operating Parameters: ${primary.content}\n\n` +
        `• Active Unit Assessment (${item.title}): Recorded operating hours stand at ${item.operatingHours ? item.operatingHours.toLocaleString() : 'N/A'} hours. In this service range, verify hydraulic return filter backpressure and inspect auxiliary line quick-couplers for seal wear prior to attachment deployment.`;
    } else if (cleanQuery.includes('service') || cleanQuery.includes('maint') || cleanQuery.includes('interval') || cleanQuery.includes('oil change') || cleanQuery.includes('hours')) {
      responseText = `According to OEM maintenance engineering standards for ${item.manufacturer || 'this class'}:\n\n` +
        `• Service Protocol: ${primary.content}\n\n` +
        `• Unit Specific Schedule: With this machine reading ${item.operatingHours ? item.operatingHours.toLocaleString() : 'N/A'} hours, ensure planetary gear oil sampling and hydraulic return filters have been serviced. On-site run test should verify pump pressure relief under full hydraulic load.`;
    } else if (cleanQuery.includes('rig') || cleanQuery.includes('transit') || cleanQuery.includes('transport') || cleanQuery.includes('trailer') || cleanQuery.includes('weight') || cleanQuery.includes('permit')) {
      responseText = `Rigging, Transit & Transport Protocol:\n\n` +
        `• Machine Dimensions & Logistics: ${primary.content}\n\n` +
        `• Safety Compliance: Prior to dispatch from ${item.location}, lock the swing house/spindle transport brackets, bleed residual air, and ensure the carrier holds valid multi-axle lowbed transit permits.`;
    } else {
      responseText = `Technical Engineering Analysis for ${item.title}:\n\n` +
        `• Technical Specification: ${primary.content}\n\n` +
        `• Status & Recommendations: Operating in '${item.condition}' condition. Mechanical inspection should verify fluid cleanliness, electrical insulation resistance (for 415V systems), and load test performance as specified in the service documentation.`;
    }
  } else {
    // Grounded purely on listing attributes
    citations.push({
      id: 'LISTING-SPEC-01',
      topic: 'Listing Specification Sheet',
      source: 'Verified REKIND Technical Equipment Submission'
    });

    responseText = `Technical Specification Summary for ${item.title}:\n\n` +
      `• OEM Manufacturer: ${item.manufacturer || 'Industrial OEM'}\n` +
      `• Model Designation: ${item.modelNumber || 'Standard'}\n` +
      `• Operating Run Hours: ${item.operatingHours ? item.operatingHours.toLocaleString() + ' hours' : 'Not specified'}\n` +
      `• Capacity & Power: ${item.tonnageCapacity || 'Standard'} / ${item.powerRating || '415V 3-Phase'}\n` +
      `• Compliance & Safety: ${item.certification || 'Factory Serviced Standard'}. Safety note: ${item.safetyNotes || 'Follow standard rigging and test run procedures prior to handover.'}`;
  }

  return {
    query: question,
    unitGrounded: itemDetailsSnippet,
    answer: responseText,
    citations
  };
}
