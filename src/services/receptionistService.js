// Configuration templates and handling for AI Receptionist across all categories

export const BUSINESS_CATEGORIES = [
  {
    id: 'hospital',
    icon: '🏥',
    name: 'Hospital / Clinic / Nursing Home',
    nameTe: 'హాస్పిటల్ / క్లినిక్ / నర్సింగ్ హోమ్',
    description: 'Patient OP registration, token allotment, doctor timing, leave notices',
    descriptionTe: 'పేషెంట్ OP బుకింగ్, టోకెన్ నంబర్, డాక్టర్ టైమింగ్స్, సెలవుల వివరాలు',
    defaultSettings: {
      businessName: 'శ్రీ బాలాజీ సూపర్ స్పెషాలిటీ హాస్పిటల్',
      tagline: '24/7 అత్యవసర & నిపుణులైన వైద్య సేవలు',
      doctorName: 'డాక్టర్ సురేష్ కుమార్ (MD, General Medicine)',
      opTimings: '10:00 AM - 2:00 PM & 5:00 PM - 9:00 PM',
      doctorArrivalTime: '10:00 AM',
      dailySlotLimit: 150,
      currentBookedSlots: 39,
      isDoctorOnLeave: false,
      isHolidayToday: false,
      address: 'మెయిన్ రోడ్, నరసరావుపేట',
      voiceGender: 'female', // 'female' | 'male'
      fieldsToCollect: [
        { id: 'name', label: 'పేరు (Name)', required: true },
        { id: 'age', label: 'వయస్సు (Age)', required: true },
        { id: 'village', label: 'ఊరు / గ్రామం (Village/City)', required: true },
        { id: 'phone', label: 'మొబైల్ నంబర్ (Phone)', required: true },
        { id: 'problem', label: 'సమస్య / కారణం (Symptoms)', required: false }
      ]
    }
  },
  {
    id: 'shop',
    icon: '🛒',
    name: 'Retail Store / Wholesale Mart',
    nameTe: 'షాప్ / సూపర్ మార్ట్ / హోల్‌సేల్ వ్యాపారం',
    description: 'Product enquiry, wholesale order taking, opening hours, stock verify',
    descriptionTe: 'వస్తువుల స్టాక్ వివరాలు, హోల్‌సేల్ ఆర్డర్స్, షాప్ టైమింగ్స్',
    defaultSettings: {
      businessName: 'శ్రీ లక్ష్మి ట్రేడర్స్ & మార్ట్',
      tagline: 'హోల్‌సేల్ & రీటైల్ నిత్యావసరాలు',
      doctorName: '',
      opTimings: '9:00 AM - 10:00 PM',
      doctorArrivalTime: '',
      dailySlotLimit: 300,
      currentBookedSlots: 15,
      isDoctorOnLeave: false,
      isHolidayToday: false,
      address: 'గాంధీ చౌక్, మెయిన్ బజార్',
      voiceGender: 'female',
      fieldsToCollect: [
        { id: 'name', label: 'కస్టమర్ పేరు (Name)', required: true },
        { id: 'phone', label: 'ఫోన్ నంబర్ (Phone)', required: true },
        { id: 'productNeeded', label: 'కావలసిన వస్తువు (Item Needed)', required: true },
        { id: 'quantity', label: 'పరిమాణం (Quantity)', required: true },
        { id: 'village', label: 'లొకేషన్ / అడ్రస్', required: true }
      ]
    }
  },
  {
    id: 'restaurant',
    icon: '🍽️',
    name: 'Restaurant / Cafe / Banquet Hall',
    nameTe: 'రెస్టారెంట్ / కేఫ్ / ఫ్యామిలీ డైనింగ్',
    description: 'Table reservations, today specials, party hall booking, timings',
    descriptionTe: 'టేబుల్ బుకింగ్, ఈరోజు స్పెషల్స్, పార్టీ ఆర్డర్స్, సమయాలు',
    defaultSettings: {
      businessName: 'స్వాగత్ గ్రాండ్ ఫ్యామిలీ రెస్టారెంట్',
      tagline: 'రుచికరమైన సాంప్రదాయ భోజనం',
      doctorName: '',
      opTimings: '11:30 AM - 11:00 PM',
      doctorArrivalTime: '',
      dailySlotLimit: 50,
      currentBookedSlots: 12,
      isDoctorOnLeave: false,
      isHolidayToday: false,
      address: 'బైపాస్ రోడ్, నరసరావుపేట',
      voiceGender: 'male',
      fieldsToCollect: [
        { id: 'name', label: 'పేరు (Name)', required: true },
        { id: 'phone', label: 'మొబైల్ నంబర్ (Phone)', required: true },
        { id: 'guestsCount', label: 'వ్యక్తుల సంఖ్య (No. of Guests)', required: true },
        { id: 'bookingTime', label: 'బుకింగ్ సమయం (Time Slot)', required: true },
        { id: 'specialRequests', label: 'ప్రత్యేక కోరికలు (Veg/Non-veg)', required: false }
      ]
    }
  },
  {
    id: 'school',
    icon: '🏫',
    name: 'School / College / Coaching Center',
    nameTe: 'స్కూల్ / కాలేజ్ / కోచింగ్ ఇన్స్టిట్యూట్',
    description: 'Admission enquiries, fee structure, bus transport, principal appointment',
    descriptionTe: 'అడ్మిషన్ వివరాలు, ఫీజుల సమాచారం, ప్రిన్సిపాల్ అపాయింట్‌మెంట్',
    defaultSettings: {
      businessName: 'వికాస్ ఇంటర్నేషనల్ స్కూల్ & జూనియర్ కాలేజ్',
      tagline: 'ఉత్తమ భవిష్యత్తుకు నాణ్యమైన విద్య',
      doctorName: 'ప్రిన్సిపాల్ రావు గారు',
      opTimings: '8:30 AM - 5:00 PM',
      doctorArrivalTime: '9:30 AM',
      dailySlotLimit: 60,
      currentBookedSlots: 18,
      isDoctorOnLeave: false,
      isHolidayToday: false,
      address: 'కాలేజ్ రోడ్, విద్యానగర్',
      voiceGender: 'female',
      fieldsToCollect: [
        { id: 'name', label: 'విద్యార్థి పేరు (Student Name)', required: true },
        { id: 'parentName', label: 'తల్లిదండ్రుల పేరు (Parent Name)', required: true },
        { id: 'phone', label: 'మొబైల్ నంబర్ (Phone)', required: true },
        { id: 'gradeSeeking', label: 'చేరవలసిన తరగతి (Class/Course)', required: true },
        { id: 'village', label: 'గ్రామం / పట్టణం', required: true }
      ]
    }
  },
  {
    id: 'hotel',
    icon: '🏨',
    name: 'Hotel / Resort / Guest House',
    nameTe: 'హోటల్ / రిసార్ట్ / లాడ్జ్',
    description: 'Room availability, check-in booking, tariff inquiry',
    descriptionTe: 'రూమ్ బుకింగ్, టారిఫ్ వివరాలు, చెక్-ఇన్ సమయాలు',
    defaultSettings: {
      businessName: 'రాయల్ ఇన్ హోటల్ & రెసిడెన్సీ',
      tagline: 'లగ్జరీ రూములు & బెస్ట్ హాస్పిటాలిటీ',
      doctorName: '',
      opTimings: '24 Hours Check-in',
      doctorArrivalTime: '',
      dailySlotLimit: 30,
      currentBookedSlots: 14,
      isDoctorOnLeave: false,
      isHolidayToday: false,
      address: 'రైల్వే స్టేషన్ ఎదురుగా',
      voiceGender: 'female',
      fieldsToCollect: [
        { id: 'name', label: 'అతిథి పేరు (Guest Name)', required: true },
        { id: 'phone', label: 'మొబైల్ నంబర్ (Phone)', required: true },
        { id: 'roomsCount', label: 'రూముల సంఖ్య (Rooms)', required: true },
        { id: 'checkInDate', label: 'రాక తేదీ (Check-in Date)', required: true },
        { id: 'city', label: 'మీ ఊరు (Origin City)', required: true }
      ]
    }
  },
  {
    id: 'office',
    icon: '🏢',
    name: 'Corporate / Real Estate / Legal Office',
    nameTe: 'కార్పొరేట్ ఆఫీస్ / రియల్ ఎస్టేట్ / లీగల్ డెస్క్',
    description: 'Client meeting appointments, enquiry collection, schedule',
    descriptionTe: 'క్లయింట్ మీటింగ్స్, సైట్ విజిట్ బుకింగ్, డాక్యుమెంట్ వెరిఫికేషన్',
    defaultSettings: {
      businessName: 'శ్రీ వెంకటేశ్వర రియల్ ఎస్టేట్స్ & లీగల్ అసోసియేట్స్',
      tagline: 'విశ్వసనీయమైన ప్రాపర్టీ & కన్సల్టింగ్ సేవలు',
      doctorName: 'మేనేజింగ్ డైరెక్టర్ శర్మ గారు',
      opTimings: '10:00 AM - 6:30 PM',
      doctorArrivalTime: '10:30 AM',
      dailySlotLimit: 40,
      currentBookedSlots: 8,
      isDoctorOnLeave: false,
      isHolidayToday: false,
      address: 'సెకండ్ ఫ్లోర్, కాంప్లెక్స్, మెయిన్ రోడ్',
      voiceGender: 'male',
      fieldsToCollect: [
        { id: 'name', label: 'క్లయింట్ పేరు (Client Name)', required: true },
        { id: 'phone', label: 'మొబైల్ నంబర్ (Phone)', required: true },
        { id: 'purpose', label: 'విషయం / పని (Purpose)', required: true },
        { id: 'village', label: 'లొకేషన్ / ఊరు', required: true }
      ]
    }
  }
];

// Helper to export registered appointments to CSV (Excel compatible)
export function exportRecordsToCSV(records, filename = 'AI_Dialer_Reception_Records.csv') {
  if (!records || records.length === 0) {
    alert('ఎటువంటి రికార్డులు లేవు (No records to export)');
    return;
  }

  // Get dynamic headers from first record
  const headers = ['Token_ID', 'Date', 'Time', 'Customer_Name', 'Age_Guests', 'Village_City', 'Phone', 'Category', 'Status', 'Allocated_Time_Slot'];

  const rows = records.map(r => [
    r.tokenNumber || r.id,
    r.date || new Date().toLocaleDateString(),
    r.time || new Date().toLocaleTimeString(),
    `"${r.name || ''}"`,
    r.age || r.guestsCount || '-',
    `"${r.village || r.city || ''}"`,
    `"${r.phone || ''}"`,
    `"${r.category || ''}"`,
    `"${r.status || 'Confirmed'}"`,
    `"${r.allocatedSlot || ''}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
    + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

