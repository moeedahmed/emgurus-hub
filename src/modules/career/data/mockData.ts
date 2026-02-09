// Mock data for EMGurus Career AI

// Country to flag emoji mapping
export const countryFlags: Record<string, string> = {
  // Popular destinations
  'UK': '🇬🇧', 'United Kingdom': '🇬🇧',
  'USA': '🇺🇸', 'United States': '🇺🇸',
  'Australia': '🇦🇺',
  'Canada': '🇨🇦',
  'Ireland': '🇮🇪',
  'Germany': '🇩🇪',
  'New Zealand': '🇳🇿',
  'Singapore': '🇸🇬',
  // Popular source countries
  'Pakistan': '🇵🇰',
  'India': '🇮🇳',
  'Bangladesh': '🇧🇩',
  'Nigeria': '🇳🇬',
  'Egypt': '🇪🇬',
  'UAE': '🇦🇪', 'United Arab Emirates': '🇦🇪',
  'Saudi Arabia': '🇸🇦',
  'Philippines': '🇵🇭',
  'Sri Lanka': '🇱🇰',
  'Sudan': '🇸🇩',
  // Additional countries
  'South Africa': '🇿🇦',
  'Kenya': '🇰🇪',
  'Ghana': '🇬🇭',
  'Malaysia': '🇲🇾',
  'Nepal': '🇳🇵',
  'Iran': '🇮🇷',
  'Iraq': '🇮🇶',
  'Jordan': '🇯🇴',
  'Lebanon': '🇱🇧',
  'Kuwait': '🇰🇼',
  'Qatar': '🇶🇦',
  'Oman': '🇴🇲',
  'Bahrain': '🇧🇭',
  'China': '🇨🇳',
  'Japan': '🇯🇵',
  'South Korea': '🇰🇷',
  'Thailand': '🇹🇭',
  'Indonesia': '🇮🇩',
  'Vietnam': '🇻🇳',
  'Myanmar': '🇲🇲',
  'France': '🇫🇷',
  'Spain': '🇪🇸',
  'Italy': '🇮🇹',
  'Netherlands': '🇳🇱',
  'Belgium': '🇧🇪',
  'Switzerland': '🇨🇭',
  'Austria': '🇦🇹',
  'Poland': '🇵🇱',
  'Sweden': '🇸🇪',
  'Norway': '🇳🇴',
  'Denmark': '🇩🇰',
  'Finland': '🇫🇮',
  'Russia': '🇷🇺',
  'Ukraine': '🇺🇦',
  'Turkey': '🇹🇷',
  'Greece': '🇬🇷',
  'Portugal': '🇵🇹',
  'Brazil': '🇧🇷',
  'Mexico': '🇲🇽',
  'Argentina': '🇦🇷',
  'Colombia': '🇨🇴',
  'Chile': '🇨🇱',
  'Peru': '🇵🇪',
  'Venezuela': '🇻🇪',
};

// Helper to get flag for a country
export const getCountryFlag = (country: string): string => {
  return countryFlags[country] || '';
};

export interface Profile {
  careerStage: string;
  currentCountry: string;
  graduationYear: string;
  trainingPath: string;
  milestonesAchieved: string[];
  yearsExperience: string;
  preferredCountries: string[];
  timeline: string;
}

export interface Goal {
  id: string;
  type: 'migrate' | 'advance' | 'expertise';
  title: string;
  narrative: string;
  targetCountry?: string;
  targetRole?: string;
  timeline: string;
  createdAt: string;
  status: 'active' | 'completed' | 'archived';
}

export interface RoadmapNode {
  id: string;
  title: string;
  timeframe: '30d' | '6mo' | '12mo' | '18mo+';
  status: 'pending' | 'in-progress' | 'completed';
  dependencies: string[];
  why: string;
  how: string[];
  examples: string[];
  sources: {
    title: string;
    url: string;
    lastVerified: string;
  }[];
  confidence: 'high' | 'medium' | 'low';
  position: { x: number; y: number };
}

export interface Roadmap {
  id: string;
  goalId: string;
  title: string;
  pathway: string;
  nodes: RoadmapNode[];
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  size: number;
  tags: string[];
  uploadedAt: string;
  url: string;
}

// Sample profile
export const sampleProfile: Profile = {
  careerStage: 'Resident',
  currentCountry: 'Pakistan',
  graduationYear: '2018',
  trainingPath: 'FCPS',
  milestonesAchieved: ['MRCP Part 1', 'FCPS Part 1'],
  yearsExperience: '5',
  preferredCountries: ['United Kingdom', 'Australia'],
  timeline: '12-18 months',
};

// Sample goals
export const sampleGoals: Goal[] = [
  {
    id: '1',
    type: 'migrate',
    title: 'Migrate to UK as Emergency Medicine Resident',
    narrative: 'I want to move to the UK and work as an EM resident. I have FCPS Part 1 cleared and 5 years of experience in Pakistan.',
    targetCountry: 'United Kingdom',
    targetRole: 'ST3-ST5 Emergency Medicine',
    timeline: '12-18 months',
    createdAt: '2024-12-01',
    status: 'active',
  },
  {
    id: '2',
    type: 'expertise',
    title: 'Subspecialize in Toxicology',
    narrative: 'I want to develop expertise in clinical toxicology while maintaining my EM practice.',
    timeline: '24 months',
    createdAt: '2024-11-15',
    status: 'active',
  },
];

// Sample roadmap for UK migration
export const sampleRoadmap: Roadmap = {
  id: '1',
  goalId: '1',
  title: 'UK Emergency Medicine Migration Pathway',
  pathway: 'Portfolio Pathway/GMC Registration → NHS Employment',
  nodes: [
    {
      id: 'node-1',
      title: 'GMC Registration',

      timeframe: '30d',
      status: 'pending',
      dependencies: [],
      why: 'GMC registration is mandatory to practice medicine in the UK. This is the first and most critical step.',
      how: [
        'Complete online GMC application',
        'Submit verified medical degree documents',
        'Provide evidence of good standing from PMC',
        'Pay registration fee (£433)',
      ],
      examples: [
        'Dr. Ahmed from Karachi completed this in 3 weeks by having all documents pre-verified',
      ],
      sources: [
        { title: 'GMC Registration Guide', url: 'https://www.gmc-uk.org/registration-and-licensing', lastVerified: 'Dec 2024' },
        { title: 'IMG Registration Requirements', url: 'https://www.gmc-uk.org/registration-and-licensing/join-the-register/before-you-apply', lastVerified: 'Dec 2024' },
      ],
      confidence: 'high',
      position: { x: 100, y: 100 },
    },
    {
      id: 'node-2',
      title: 'PLAB 2 Examination',

      timeframe: '6mo',
      status: 'pending',
      dependencies: ['node-1'],
      why: 'PLAB 2 is required for GMC registration if you don\'t have an accepted postgraduate qualification.',
      how: [
        'Book PLAB 2 slot at Manchester test center',
        'Complete approved PLAB 2 preparation course',
        'Practice OSCE scenarios (16 stations)',
        'Pass with minimum required score',
      ],
      examples: [
        'Most candidates benefit from 2-4 weeks of dedicated preparation',
      ],
      sources: [
        { title: 'PLAB 2 Information', url: 'https://www.gmc-uk.org/registration-and-licensing/join-the-register/plab', lastVerified: 'Dec 2024' },
      ],
      confidence: 'high',
      position: { x: 300, y: 100 },
    },
    {
      id: 'node-3',
      title: 'NHS Trust Applications',

      timeframe: '6mo',
      status: 'pending',
      dependencies: ['node-2'],
      why: 'NHS trusts are the primary employers for doctors in the UK. Getting a job offer is essential for visa sponsorship.',
      how: [
        'Create NHS Jobs account',
        'Prepare UK-format CV',
        'Write compelling personal statement',
        'Apply to multiple trusts (recommended: 10-15)',
        'Prepare for interviews',
      ],
      examples: [
        'Trust grade positions are often easier to secure initially before moving to training posts',
      ],
      sources: [
        { title: 'NHS Jobs Portal', url: 'https://www.jobs.nhs.uk', lastVerified: 'Dec 2024' },
        { title: 'BMA IMG Guide', url: 'https://www.bma.org.uk/advice-and-support/international-doctors', lastVerified: 'Dec 2024' },
      ],
      confidence: 'medium',
      position: { x: 500, y: 100 },
    },
    {
      id: 'node-4',
      title: 'Skilled Worker Visa',

      timeframe: '12mo',
      status: 'pending',
      dependencies: ['node-3'],
      why: 'The Skilled Worker visa is the primary route for international doctors to work in the UK NHS.',
      how: [
        'Receive Certificate of Sponsorship from NHS trust',
        'Complete online visa application',
        'Provide biometrics at visa center',
        'Pay Immigration Health Surcharge',
        'Wait for visa decision (usually 3 weeks)',
      ],
      examples: [
        'Health and care worker visa has reduced fees and faster processing',
      ],
      sources: [
        { title: 'UK Visa Information', url: 'https://www.gov.uk/skilled-worker-visa', lastVerified: 'Dec 2024' },
      ],
      confidence: 'high',
      position: { x: 700, y: 100 },
    },
    {
      id: 'node-5',
      title: 'Portfolio Pathway Preparation',

      timeframe: '18mo+',
      status: 'pending',
      dependencies: ['node-4'],
      why: 'The Portfolio Pathway allows you to join the specialist register without completing UK training, enabling consultant-level positions.',
      how: [
        'Map your experience to UK curriculum',
        'Gather evidence for each competency',
        'Obtain supervisor testimonials',
        'Compile portfolio',
        'Submit to GMC for assessment',
      ],
      examples: [
        'Average Portfolio Pathway preparation takes 6-12 months of dedicated documentation',
      ],
      sources: [
        { title: 'Portfolio Pathway Guidelines', url: 'https://www.gmc-uk.org/registration-and-licensing/join-the-register/registration-pathways/portfolio-pathway', lastVerified: 'Dec 2024' },
      ],
      confidence: 'medium',
      position: { x: 900, y: 100 },
    },
  ],
  createdAt: '2024-12-01',
};

// Sample documents
export const sampleDocuments: Document[] = [
  {
    id: '1',
    name: 'Medical Degree Certificate.pdf',
    type: 'pdf',
    size: 2500000,
    tags: ['degree', 'education'],
    uploadedAt: '2024-11-20',
    url: '#',
  },
  {
    id: '2',
    name: 'PMC Registration.pdf',
    type: 'pdf',
    size: 1200000,
    tags: ['registration', 'PMC'],
    uploadedAt: '2024-11-20',
    url: '#',
  },
];

export const careerStageOptions = [
  // Training stages
  'Medical Student',
  'Intern',
  'Resident',
  'Senior Resident',
  'Fellow',
  // Practicing stages
  'Consultant',
  'Specialist',
  // Non-training positions
  'Medical Officer',
  'Clinical Fellow',
  // Other
  'Not Currently Practicing',
];

// Medical specialties
export const specialtyOptions = [
  'Emergency Medicine',
  'Internal Medicine',
  'Surgery (General)',
  'Cardiology',
  'Pediatrics',
  'Neonatology',
  'Obstetrics & Gynecology',
  'Orthopedics',
  'Psychiatry',
  'Neurology',
  'Radiology',
  'Anesthesiology',
  'Dermatology',
  'Ophthalmology',
  'ENT (Otolaryngology)',
  'Urology',
  'Nephrology',
  'Pulmonology',
  'Gastroenterology',
  'Oncology',
  'Family Medicine',
  'Pathology',
  'Critical Care / ICU',
  'Infectious Disease',
  'Rheumatology',
  'Endocrinology',
  'Hematology',
  'Geriatric Medicine',
  'Palliative Medicine',
  'Rehabilitation Medicine / PM&R',
  'Sports Medicine',
  'Public Health',
  'Neurosurgery',
  'Cardiothoracic Surgery',
  'Plastic Surgery',
  'Vascular Surgery',
  'Other',
];

// Popular source countries (where users commonly come from)
export const popularSourceCountries = [
  'Pakistan',
  'India',
  'Bangladesh',
  'Nigeria',
  'Egypt',
  'United Arab Emirates',
  'Saudi Arabia',
  'Philippines',
  'Sri Lanka',
  'Sudan',
];

// Popular destination countries for medical migration
export const popularDestinationCountries = [
  'United Kingdom',
  'United States',
  'Australia',
  'Canada',
  'Ireland',
  'Germany',
  'New Zealand',
  'Singapore',
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
  'France',
  'Spain',
  'Italy',
];

// All countries (comprehensive list)
export const allCountries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon',
  'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador',
  'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
  'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
  'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
  'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
  'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
  'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
  'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
  'Tuvalu', 'United Arab Emirates', 'Uganda', 'United Kingdom', 'Ukraine', 'Uruguay', 'United States', 'Uzbekistan', 'Vanuatu', 'Vatican City',
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
];

// Legacy export for backward compatibility
export const countryOptions = [...popularSourceCountries, ...popularDestinationCountries];

// Popular career paths (quick access)
export const popularCareerPaths = [
  'FCPS (Pakistan)',
  'FRCEM (UK)',
  'MD Emergency Medicine (India)',
  'MRCEM (UK)',
  'Board Certification (USA)',
  'FACEM (Australia)',
  'Not in formal training',
  'Completed training',
  'Exploring options',
];

// All career paths (comprehensive list)
export const allCareerPaths = [
  // UK Pathways
  'FRCEM (UK)',
  'MRCEM (UK)',
  'CCT Emergency Medicine (UK)',
  'Portfolio Pathway (UK)',
  'Foundation Year (UK)',
  'Core Training CT1-CT2 (UK)',
  'ST Training ST3-ST8 (UK)',
  'Trust Grade/SHO (UK)',
  'Clinical Fellow (UK)',

  // USA Pathways
  'Board Certification (USA)',
  'ABEM Certification (USA)',
  'Emergency Medicine Residency (USA)',
  'EM Fellowship Programs (USA)',
  'Pediatric EM Fellowship (USA)',
  'Toxicology Fellowship (USA)',

  // Australia & New Zealand
  'FACEM (Australia/NZ)',
  'ACEM Training Program',
  'IMG Pathway (Australia)',
  'Provisional Fellow (Australia)',

  // Canada
  'FRCPC Emergency Medicine (Canada)',
  'CCFP-EM (Canada)',
  'Royal College EM (Canada)',

  // European Union
  'European Board of Emergency Medicine',
  'Facharzt Emergency Medicine (Germany)',
  'Urgences Médicales (France)',
  'Medicina de Urgencias (Spain)',

  // South Asia
  'FCPS Emergency Medicine (Pakistan)',
  'MCPS Emergency Medicine (Pakistan)',
  'MD Emergency Medicine (India)',
  'DNB Emergency Medicine (India)',
  'MRCEM (India)',
  'Fellowship in EM (India)',

  // Middle East
  'Arab Board Emergency Medicine',
  'Saudi Board Emergency Medicine',
  'DHA License (Dubai)',
  'DOH License (Abu Dhabi)',
  'MOH License (Saudi)',
  'QCHP License (Qatar)',
  'HAAD License (Abu Dhabi)',

  // Southeast Asia
  'MCEM (Malaysia)',
  'MRCS + EM (Singapore)',
  'Emergency Medicine Specialist (Philippines)',

  // Africa
  'FCEM (South Africa)',
  'Emergency Medicine MMed (East Africa)',

  // General/Non-training
  'Not in formal training',
  'Completed training',
  'Exploring options',
  'Career break',
  'Academia/Research',
  'Private practice',
  'Medical Officer/SHO',
  'Locum/Agency work',
];

// Legacy export for backward compatibility
export const trainingPathOptions = popularCareerPaths;

export const examOptions = [
  'MRCP Part 1',
  'MRCP Part 2',
  'MRCEM Primary',
  'MRCEM Intermediate',
  'MRCEM Final',
  'FCPS Part 1',
  'FCPS Part 2',
  'PLAB 1',
  'PLAB 2',
  'USMLE Step 1',
  'USMLE Step 2',
  'AMC MCQ',
  'AMC Clinical',
];

export const experienceOptions = [
  '0-2 years',
  '3-5 years',
  '6-10 years',
  '10+ years',
];

export const timelineOptions = [
  '3-6 months',
  '6-12 months',
  '12-18 months',
  '18-24 months',
  '2+ years',
];

export const workRhythmOptions = [
  { value: 'full_time', label: 'Full Time (100%)' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'locum', label: 'Locum / Per Diem' },
  { value: 'research', label: 'Research / Academic Block' },
  { value: 'shift_work', label: 'Shift Work' },
  { value: 'career_break', label: 'Career Break' },
];

// Testimonials for landing page
export const testimonials = [
  {
    id: '1',
    name: 'Dr. Sarah Ahmed',
    role: 'EM Resident, UK',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    quote: 'EMGurus helped me navigate the complex GMC registration process. I\'m now working in a London A&E department.',
    country: 'Pakistan → United Kingdom',
  },
  {
    id: '2',
    name: 'Dr. Raj Patel',
    role: 'Emergency Physician, Australia',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raj',
    quote: 'The personalized roadmap was exactly what I needed. Every step was clearly laid out with verified sources.',
    country: 'India → Australia',
  },
  {
    id: '3',
    name: 'Dr. Fatima Hassan',
    role: 'Portfolio Pathway Applicant, UK',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatima',
    quote: 'Finally, a tool that understands the specific challenges of international medical graduates.',
    country: 'Egypt → United Kingdom',
  },
];

// Institution logos for social proof
export const institutions = [
  { name: 'NHS', logo: '🏥' },
  { name: 'GMC', logo: '📋' },
  { name: 'RCEM', logo: '🩺' },
  { name: 'ACEM', logo: '🏨' },
];
