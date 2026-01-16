import { TeamMember, ServiceItem, ClientCategory, ChartDataPoint, TimelineStep } from './types';

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Celica Dharmawan, M.Sc",
    title: "Senior Environmental Consultant / Strategy & Operations Lead",
    education: ["Masters of Urban and Environmental Planning", "Masters of Environment (Climate Change Adaptation) | Griffith University, Australia"],
    experience: "9+ years of Experience",
    expertise: "Environmental Impact Assessment & Management, Hazardous Waste Management, Climate Change Adaptation.",
    imageSeed: 101
  },
  {
    name: "Erza Winanto, B.Sc",
    title: "Environmental Consultant / Geologist / QC & Product",
    education: ["Bachelor of Geological Engineering | Bandung Institute of Technology"],
    experience: "5+ years of Experience | Certified Environmental Impact Assessor (ATPA)",
    expertise: "Environmental Impact Assessment, Geological Analysis, Mining Environmental Management, Spatial Analysis.",
    imageSeed: 102
  },
  {
    name: "Prabowo Setiawan, B.Sc",
    title: "Environmental Consultant / Marine Scientist",
    education: ["Bachelor of Marine Science | Hasanuddin University, Makassar"],
    experience: "5+ years of Experience",
    expertise: "Environmental Impact Assessment, Marine Biodiversity Analysis, Underwater Survey, Coral Reef Monitoring.",
    imageSeed: 103
  },
  {
    name: "Rafiedhia Abel M Pasha, B.Eng",
    title: "Environmental Consultant / Air Quality Expert",
    education: ["Bachelor of Engineering (Metallurgy) | Institut Teknologi Sepuluh Nopember"],
    experience: "4+ years of Experience",
    expertise: "Process Engineering, Industrial Design, Air Quality Analysis, Pollution Dispersion Modelling (AERMOD).",
    imageSeed: 104
  },
  {
    name: "Yolanda Hantari, B.Eng",
    title: "Project Manager / Mining Environmental Expert",
    education: ["Bachelor of Mining Engineering | UPN Veteran Yogyakarta"],
    experience: "7+ years of Experience",
    expertise: "Mining Engineering, Coal and Mineral Processing, Mining Waste Management, EIA.",
    imageSeed: 105
  },
  {
    name: "M. Regi Fahril Nurhakim, A.Md.T",
    title: "Project Manager / Civil Engineer",
    education: ["Diploma of Civil Engineering | Bandung State Polytechnic"],
    experience: "4+ years of Experience",
    expertise: "Civil Engineering, WWTP Design, Traffic Impact Analysis, AutoCAD & Tekla Modelling.",
    imageSeed: 106
  },
  {
    name: "Yenny Tjoe, Ph.D",
    title: "Socioeconomic and Environmental Economics Expert",
    education: ["Doctor of Philosophy in Development Economics | Griffith University, Australia"],
    experience: "9+ years of Experience",
    expertise: "Community Development, Mixed-Method Social Research, Sustainable Livelihoods.",
    imageSeed: 107
  },
  {
    name: "Muhammad Azwar, B.Eng",
    title: "Engineering Design & Business Development / Chemical Engineer",
    education: ["Bachelor of Applied Chemical Engineering | Sriwijaya University"],
    experience: "3+ years of Experience",
    expertise: "Process Engineering, Energy Audit, Chemical Process Analysis, Hazardous Waste Management.",
    imageSeed: 108
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: "s1",
    number: "01",
    title: "Screening & Feasibility Study",
    iconName: "FileSearch",
    description: [
      "Legal & Technical Data Review",
      "Screening & Scoping",
      "Development & Land Use Approval (PKKPR / IPPKH)",
      "Feasibility Study (For Mining only*)",
      "Baseline Study"
    ]
  },
  {
    id: "s2",
    number: "02",
    title: "Environmental Approval",
    iconName: "CheckCircle",
    description: [
      "Environmental Technical Approval (PERTEK)",
      "EIA (AMDAL)",
      "EMP (UKL-UPL)",
      "Environmental Evaluation Document (DELH/DPLH)",
      "Environmental Management Plan Update (Integrasi / Updating RKL-RPL)"
    ]
  },
  {
    id: "s3",
    number: "03",
    title: "Operation",
    iconName: "Factory",
    description: [
      "Operation Worthy Certificate (SLO / SLF)",
      "Biannual Environmental Management and Monitoring Implementation (Laporan Semester RKL-RPL)"
    ]
  },
  {
    id: "s4",
    number: "04",
    title: "Evaluation",
    iconName: "TrendingUp",
    description: [
      "Environmental Gap Analysis",
      "Environmental Audit",
      "Environmental Awareness Training"
    ]
  }
];

export const EXPERIENCE_DATA: ChartDataPoint[] = [
  { name: 'AMDAL', value: 9 },
  { name: 'Ad_AMDAL', value: 4 },
  { name: 'UKL-UPL', value: 11 },
  { name: 'DELH', value: 4 },
  { name: 'DPLH', value: 2 },
  { name: 'PERTEK', value: 13 },
  { name: 'LS', value: 7 },
  { name: 'UPDATING', value: 7 },
];

export const CLIENTS: ClientCategory[] = [
  {
    category: "Building & Infrastructure",
    clients: [
      "PT Indonesia Morowali Industrial Park",
      "PT Indonesia Weda Bay Industrial Park",
      "Kawasan Industri Mitra Karawang 2",
      "PT Wijaya Karya, Tbk",
      "PT Wika Realty",
      "PT Ramcomas Mandiri"
    ]
  },
  {
    category: "Manufacturing",
    clients: [
      "PT Inter World Steel Mills",
      "PT Dayasa Aria Prima",
      "Wilmar Group",
      "PT Berkah Manis Makmur",
      "PT Randu World Hub"
    ]
  },
  {
    category: "Mining & Mineral Processing",
    clients: [
      "Artisanal Gold Council",
      "Billy Group Nickel Mining",
      "SLS Group Coal Mining",
      "PT Indonesia Mas Mulia",
      "PT Mineral Trobos",
      "PT Nusa Halmahera Minerals",
      "PT Bosowa Mining",
      "PT Ang & Fang Brothers"
    ]
  },
  {
    category: "Hazardous Waste Management",
    clients: [
      "PT BSSTEC",
      "PT Mitra Maju Bersama Makmur",
      "PT Luckione Environmental Science Indonesia"
    ]
  },
  {
    category: "Energy",
    clients: [
      "PT Indonesia Power UP Suralaya",
      "PT Indonesia Power UJP Pangkalan Susu",
      "PT PLN (Persero)",
      "PT Bhimasena Power Indonesia",
      "TIS Petroleum E&P Blora Pte. Ltd.",
      "Santos (Sampang) Pty Ltd",
      "Jadestone Energy Pty Ltd"
    ]
  }
];

export const PROCESS_STEPS: TimelineStep[] = [
  {
    id: 1,
    title: "Initiation",
    description: "Activity proponent submits request for guidance regarding activities already running without environmental documents (DELH/DPLH)."
  },
  {
    id: 2,
    title: "Verification",
    description: "KLHK Team performs field verification if necessary to assess current status."
  },
  {
    id: 3,
    title: "Coordination",
    description: "Coordination meeting to fulfill DELH/DPLH criteria. Director of PDLUK submits request for administrative sanctions to Dirjen Gakkum KLHK."
  },
  {
    id: 4,
    title: "Sanctioning Process",
    description: "Verification meeting for complaints by Director PPSA Dirjen Gakkum KLHK. Issuance of administrative sanctions (Paksaan Pemerintah)."
  },
  {
    id: 5,
    title: "Document Submission",
    description: "Business actor submits Application Letter for Environmental Approval via DELH/DPLH to MENLHK online via PTSP."
  },
  {
    id: 6,
    title: "Assessment",
    description: "Assessment of DELH/DPLH by Dit. Prevention of Business & Activity Environmental Impacts. Recommendation issued by Evaluation Team."
  },
  {
    id: 7,
    title: "Approval",
    description: "Issuance of Environmental Approval (DLH/DPLH) via PTSP attached with final documents."
  }
];