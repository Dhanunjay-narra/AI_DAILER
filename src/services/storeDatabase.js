// Local store discovery service with realistic shop simulation & Google Places API support

export const CATEGORY_SHOPS = {
  plastic: [
    {
      name: 'Sri Lakshmi Plastic Mart & Wholesale',
      nameTe: 'శ్రీ లక్ష్మి ప్లాస్టిక్ మార్ట్ & హోల్‌సేల్',
      type: 'Plastics & Containers Store',
      rating: 4.8,
      reviewsCount: 142,
      phone: '+91 98480 23411',
      address: 'Main Road, Near Old Bus Stand',
      distanceKm: 0.8,
      priceRange: '₹40 - ₹65',
      stockStatus: 'available',
      stockConfidence: 98,
      sampleDialogue: {
        te: [
          { speaker: 'ai', text: 'నమస్కారం అండి! నేను AI అసిస్టెంట్‌ని. మీ దగ్గర 500ml హెవీ డ్యూటీ ప్లాస్టిక్ కంటైనర్లు స్టాక్ ఉన్నాయా అండి?' },
          { speaker: 'shop', text: 'నమస్కారం! అవునండి, ఫుడ్ గ్రేడ్ 500ml మరియు 1000ml కంటైనర్లు రెండు బాక్సులు స్టాక్ ఉన్నాయి.' },
          { speaker: 'ai', text: 'చాలా మంచిదండి, ఒక్క బాక్స్ లేదా ఒక్క పీస్ ధర ఎంత పడుతుంది?' },
          { speaker: 'shop', text: 'ఒక్క పీస్ ₹45 అండి, డజన్ తీసుకుంటే ₹480 కే ఇస్తాం.' },
          { speaker: 'ai', text: 'ధన్యవాదాలు అండి, కస్టమర్‌కి ఈ సమాచారం చేరవేస్తాను. నమస్తే!' }
        ],
        en: [
          { speaker: 'ai', text: 'Hello! I am an AI calling on behalf of a customer. Do you currently have 500ml food-grade plastic containers in stock?' },
          { speaker: 'shop', text: 'Yes, we have 500ml air-tight clear plastic containers available right now.' },
          { speaker: 'ai', text: 'Wonderful! What is the price per piece?' },
          { speaker: 'shop', text: 'It is ₹45 each, or ₹480 for a pack of 12.' },
          { speaker: 'ai', text: 'Thank you so much! I will inform the customer.' }
        ]
      }
    },
    {
      name: 'Vijaya Crockery & Household Plastics',
      nameTe: 'విజయ క్రాకరీ & హౌస్‌హోల్డ్ ప్లాస్టిక్స్',
      type: 'Kitchenware & Home Needs',
      rating: 4.5,
      reviewsCount: 89,
      phone: '+91 94401 87652',
      address: 'Shop #14, Municipal Shopping Complex',
      distanceKm: 1.4,
      priceRange: '₹50 - ₹75',
      stockStatus: 'available',
      stockConfidence: 94,
      sampleDialogue: {
        te: [
          { speaker: 'ai', text: 'నమస్కారం అండి, మీ షాప్‌లో 500ml ప్లాస్టిక్ స్టోరేజ్ బాక్సులు అందుబాటులో ఉన్నాయా?' },
          { speaker: 'shop', text: 'హలో, ఉన్నాయి అండి. లాకింగ్ మూత ఉన్నవి 6 పీస్‌లు ఉన్నాయి, పీస్ ₹50.' },
          { speaker: 'ai', text: 'సరే అండి, షాప్ రాత్రి ఎన్ని గంటల వరకు ఓపెన్ ఉంటుంది?' },
          { speaker: 'shop', text: 'రాత్రి 9:30 వరకు ఓపెన్ ఉంటుంది రండి.' },
          { speaker: 'ai', text: 'చాలా థాంక్స్ అండి!' }
        ],
        en: [
          { speaker: 'ai', text: 'Hello, checking if you have 500ml storage containers available today?' },
          { speaker: 'shop', text: 'Yes sir, we have lock-lid models available, ₹50 per container.' },
          { speaker: 'ai', text: 'Great, thank you for confirming!' }
        ]
      }
    },
    {
      name: 'Balaji Poly & General Merchants',
      nameTe: 'బాలాజీ పాలీ & జనరల్ మర్చంట్స్',
      type: 'General Plastic Store',
      rating: 4.1,
      reviewsCount: 56,
      phone: '+91 89782 54310',
      address: 'Bazaar Street, Opposite Gandhi Statue',
      distanceKm: 2.2,
      priceRange: 'Out of Stock',
      stockStatus: 'out_of_stock',
      stockConfidence: 90,
      sampleDialogue: {
        te: [
          { speaker: 'ai', text: 'నమస్కారం బాలాజీ స్టోర్స్, మీ వద్ద 500ml ప్లాస్టిక్ కంటైనర్ డబ్బాలు ఉన్నాయా?' },
          { speaker: 'shop', text: 'ప్రస్తుతం 500ml సైజ్ అయిపోయిందండి. కేవలం 1 లీటర్ డబ్బాలు మాత్రమే ఉన్నాయి. రేపు ఈవెనింగ్ కొత్త స్టాక్ వస్తుంది.' },
          { speaker: 'ai', text: 'సరేనండి, అర్థమైంది. వివరాలకు ధన్యవాదాలు!' }
        ],
        en: [
          { speaker: 'ai', text: 'Hello Balaji Poly, do you have 500ml plastic containers right now?' },
          { speaker: 'shop', text: 'Sorry, 500ml size is out of stock today. Only 1 Litre is available. Fresh stock arrives tomorrow evening.' },
          { speaker: 'ai', text: 'Understood, thank you for checking!' }
        ]
      }
    }
  ],

  hardware: [
    {
      name: 'Supreme Hardware & Power Tools',
      nameTe: 'సుప్రీం హార్డ్‌వేర్ & పవర్ టూల్స్',
      type: 'Hardware & Machinery',
      rating: 4.7,
      reviewsCount: 198,
      phone: '+91 98492 11099',
      address: 'Industrial Estate Road, By-pass',
      distanceKm: 1.1,
      priceRange: '₹180 - ₹350',
      stockStatus: 'available',
      stockConfidence: 99,
      sampleDialogue: {
        te: [
          { speaker: 'ai', text: 'నమస్కారం సుప్రీం హార్డ్‌వేర్, మీ దగ్గర 10mm మేసనరీ డ్రిల్ బిట్ సెట్ ఉందా అండి?' },
          { speaker: 'shop', text: 'అవునండి, Bosch మరియు DeWalt ఒరిజినల్ బిట్స్ రెడీగా స్టాక్ ఉన్నాయి.' },
          { speaker: 'ai', text: 'ధర ఎంత పడుతుందో చెప్పగలరా?' },
          { speaker: 'shop', text: 'సింగిల్ బిట్ ₹180, 5-పీస్ సెట్ ₹650.' },
          { speaker: 'ai', text: 'సరేనండి, కస్టమర్‌కి వెంటనే తెలియజేస్తాను. థాంక్యూ!' }
        ],
        en: [
          { speaker: 'ai', text: 'Hello Supreme Hardware, do you have 10mm drill bits in stock?' },
          { speaker: 'shop', text: 'Yes, both Bosch and standard masonry drill bits are readily available.' },
          { speaker: 'ai', text: 'What is the price?' },
          { speaker: 'shop', text: 'Single bit is ₹180, set is ₹650.' }
        ]
      }
    },
    {
      name: 'Venkateswara Electricals & Tools',
      nameTe: 'వెంకటేశ్వర ఎలక్ట్రికల్స్ & టూల్స్',
      type: 'Tools & Electricals',
      rating: 4.3,
      reviewsCount: 77,
      phone: '+91 97003 44821',
      address: 'Cross Roads, Near Water Tank',
      distanceKm: 1.9,
      priceRange: '₹190',
      stockStatus: 'available',
      stockConfidence: 92,
      sampleDialogue: {
        te: [
          { speaker: 'ai', text: 'హలో వెంకటేశ్వర ఎలక్ట్రికల్స్, డ్రిల్ మెషిన్ బిట్స్ ఉన్నాయా?' },
          { speaker: 'shop', text: 'ఉన్నాయి అండి, అన్ని సైజులు ఉన్నాయి.' }
        ],
        en: [
          { speaker: 'ai', text: 'Hello, do you carry drill bits?' },
          { speaker: 'shop', text: 'Yes, all standard sizes are in stock.' }
        ]
      }
    }
  ],

  general: [
    {
      name: 'City Super Mart & Essentials',
      nameTe: 'సిటీ సూపర్ మార్ట్ & ఎసెన్షియల్స్',
      type: 'Supermarket & Essentials',
      rating: 4.6,
      reviewsCount: 310,
      phone: '+91 99890 55123',
      address: 'Ring Road Junction',
      distanceKm: 0.9,
      priceRange: 'Standard MRP',
      stockStatus: 'available',
      stockConfidence: 95,
      sampleDialogue: {
        te: [
          { speaker: 'ai', text: 'నమస్కారం, మీ సూపర్ మార్కెట్‌లో ఈ ప్రొడక్ట్ స్టాక్ అందుబాటులో ఉందా?' },
          { speaker: 'shop', text: 'అవునండి, మా రాక్స్‌లో అందుబాటులో ఉంది, మీరు వచ్చి తీసుకోవచ్చు.' }
        ],
        en: [
          { speaker: 'ai', text: 'Hello, checking if this product is currently in stock?' },
          { speaker: 'shop', text: 'Yes, it is available on aisle 3.' }
        ]
      }
    },
    {
      name: 'Modern Stores & Provisions',
      nameTe: 'మోడరన్ స్టోర్స్',
      type: 'Daily Needs & Essentials',
      rating: 4.2,
      reviewsCount: 64,
      phone: '+91 98851 66734',
      address: 'Temple Street',
      distanceKm: 1.6,
      priceRange: 'Check in store',
      stockStatus: 'available',
      stockConfidence: 88,
      sampleDialogue: {
        te: [
          { speaker: 'ai', text: 'నమస్కారం అండి, ఈ ఐటెం స్టాక్ ఉందా?' },
          { speaker: 'shop', text: 'ఉంది అండి, రాత్రి 10 వరకు షాప్ ఉంటుంది.' }
        ],
        en: [
          { speaker: 'ai', text: 'Hello, do you have this item in stock?' },
          { speaker: 'shop', text: 'Yes, we are open until 10 PM.' }
        ]
      }
    }
  ]
};

// Helper to find shops based on query text
export function searchShopsForProduct(query, locationName = 'Kukatpally, Hyderabad') {
  const cleanQuery = query.toLowerCase();
  
  let selectedCategory = 'general';
  if (cleanQuery.includes('plastic') || cleanQuery.includes('container') || cleanQuery.includes('box') || cleanQuery.includes('bottle') || cleanQuery.includes('bucket') || cleanQuery.includes('ప్లాస్టిక్')) {
    selectedCategory = 'plastic';
  } else if (cleanQuery.includes('drill') || cleanQuery.includes('hardware') || cleanQuery.includes('screw') || cleanQuery.includes('tool') || cleanQuery.includes('paint') || cleanQuery.includes('పైపు') || cleanQuery.includes('డ్రిల్')) {
    selectedCategory = 'hardware';
  }

  const shops = CATEGORY_SHOPS[selectedCategory] || CATEGORY_SHOPS.general;

  // Clone and enrich with realistic local address based on current area
  return shops.map((shop, idx) => ({
    ...shop,
    id: `shop-${Date.now()}-${idx}`,
    productQueried: query,
    area: locationName,
    fullAddress: `${shop.address}, ${locationName}`,
    verifiedAt: null,
  }));
}
