import { Issue, UserProfile, SocietyNotice, FacilityItem } from '../types';

export const INITIAL_ISSUES: Issue[] = [
  {
    id: 'URB-2026-1042',
    title: 'Deep pothole blocking bike lane',
    category: 'Potholes',
    societyName: 'Maple Heights Society',
    address: '5th Ave & Main St',
    description: 'A large pothole has developed right in the dedicated bicycle and walking path outside the western perimeter. Multiple residents have tripped during evening walks.',
    status: 'Pending',
    priority: 'High',
    date: 'Jul 29, 2026',
    timestamp: 1785283200000,
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    reporterName: 'Aditya S.',
    reporterUnit: 'Tower B - Flat 304',
    assignedDepartment: 'Civil Works & Road Maintenance',
    upvotes: 14,
    mapCoords: { x: 34, y: 52 },
    timeline: [
      {
        status: 'Submitted',
        label: 'Complaint Logged',
        date: 'Jul 29, 2026, 09:30 AM',
        note: 'Ticket automatically routed to Civil Works Department.'
      },
      {
        status: 'Pending',
        label: 'Triage in Progress',
        date: 'Jul 29, 2026, 11:15 AM',
        note: 'Awaiting site inspection officer dispatch.'
      }
    ],
    comments: [
      {
        id: 'c1',
        author: 'Society Secretary (R. Sharma)',
        text: 'Noted. Asphalt contractor has been contacted for repair patch tomorrow morning.',
        date: 'Jul 29, 2026, 02:40 PM',
        isStaff: true
      },
      {
        id: 'c2',
        author: 'Resident (Priya M.)',
        text: 'Please place a temporary hazard cone there tonight so cyclists avoid it.',
        date: 'Jul 29, 2026, 04:10 PM',
        isStaff: false
      }
    ]
  },
  {
    id: 'URB-2026-1041',
    title: 'Streetlight out for a week',
    category: 'Streetlights',
    societyName: 'Elm Park Residency',
    address: 'Oak Street, near Elm Park',
    description: 'Post #14 streetlight LED module has been flickering and completely burned out last Tuesday. The pedestrian walkway is completely dark after 7:30 PM.',
    status: 'In Progress',
    priority: 'Medium',
    date: 'Jul 27, 2026',
    timestamp: 1785110400000,
    photoUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    reporterName: 'Carlos M.',
    reporterUnit: 'Villa 12',
    assignedDepartment: 'Electrical Services & Lighting',
    upvotes: 9,
    mapCoords: { x: 62, y: 28 },
    timeline: [
      {
        status: 'Submitted',
        label: 'Complaint Logged',
        date: 'Jul 27, 2026, 08:15 AM',
        note: 'Reported by Carlos M.'
      },
      {
        status: 'Assigned',
        label: 'Electrician Assigned',
        date: 'Jul 27, 2026, 01:20 PM',
        note: 'Work order #EL-884 issued to technician Ramesh.'
      },
      {
        status: 'In Progress',
        label: 'Replacement Driver Sourced',
        date: 'Jul 28, 2026, 10:00 AM',
        note: 'New 65W LED driver ordered; installation scheduled today.'
      }
    ],
    comments: [
      {
        id: 'c3',
        author: 'Chief Electrician Ramesh',
        text: 'Found capacitor failure in the pole ballast. Replacement arrived this morning.',
        date: 'Jul 28, 2026, 11:30 AM',
        isStaff: true
      }
    ]
  },
  {
    id: 'URB-2026-1039',
    title: 'Low water pressure on 7th floor & above',
    category: 'Water Supply',
    societyName: 'Maple Heights Society',
    address: 'Block C & D Booster Pump Room',
    description: 'Pressure drops below 0.8 bar during morning peak hours (7:00 - 9:00 AM). Hydro-pneumatic booster system needs inspection.',
    status: 'In Progress',
    priority: 'High',
    date: 'Jul 25, 2026',
    timestamp: 1784937600000,
    photoUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
    reporterName: 'Sunita Rao',
    reporterUnit: 'Block C - Flat 802',
    assignedDepartment: 'Water & Plumbing Operations',
    upvotes: 27,
    mapCoords: { x: 45, y: 70 },
    timeline: [
      {
        status: 'Submitted',
        label: 'Report Logged',
        date: 'Jul 25, 2026, 07:45 AM',
        note: 'Multiple resident calls received.'
      },
      {
        status: 'In Progress',
        label: 'Plumber Inspection Ongoing',
        date: 'Jul 25, 2026, 11:00 AM',
        note: 'Secondary pump pressure switch recalibration in progress.'
      }
    ],
    comments: [
      {
        id: 'c4',
        author: 'Facility Manager',
        text: 'Secondary pump impeller cleaned. Testing pressure gauges across all floors.',
        date: 'Jul 26, 2026, 09:15 AM',
        isStaff: true
      }
    ]
  },
  {
    id: 'URB-2026-1035',
    title: 'Overflowing green waste bin near Gate 2',
    category: 'Garbage & Waste',
    societyName: 'Greenview Enclave',
    address: 'Gate 2 Recycling Enclosure',
    description: 'Garden clippings and pruned branches have spilled out of the designated composter enclosure onto the driveway.',
    status: 'Resolved',
    priority: 'Low',
    date: 'Jul 22, 2026',
    timestamp: 1784678400000,
    photoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    reporterName: 'David Lee',
    reporterUnit: 'Apt 108',
    assignedDepartment: 'Sanitation & Housekeeping',
    upvotes: 6,
    mapCoords: { x: 78, y: 64 },
    timeline: [
      {
        status: 'Submitted',
        label: 'Reported',
        date: 'Jul 22, 2026, 08:10 AM'
      },
      {
        status: 'In Progress',
        label: 'Sanitation Team Dispatched',
        date: 'Jul 22, 2026, 10:30 AM'
      },
      {
        status: 'Resolved',
        label: 'Cleared & Composted',
        date: 'Jul 22, 2026, 01:45 PM',
        note: 'Enclosure cleared, bins sanitized, extra compost bag placed.'
      }
    ],
    comments: [
      {
        id: 'c5',
        author: 'Sanitation Lead',
        text: 'Cleared completely and area power-washed. Resolution verified.',
        date: 'Jul 22, 2026, 02:00 PM',
        isStaff: true
      }
    ]
  },
  {
    id: 'URB-2026-1030',
    title: 'Elevator Lift #2 Jerking between 3rd & 4th floors',
    category: 'Elevator',
    societyName: 'Maple Heights Society',
    address: 'Tower A Elevator Shaft',
    description: 'Noticeable vertical jerk and scraping noise when passing the 3rd floor door sensor. Needs urgent preventive servicing.',
    status: 'In Progress',
    priority: 'Urgent',
    date: 'Jul 20, 2026',
    timestamp: 1784505600000,
    photoUrl: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=600&q=80',
    reporterName: 'Sarah Jenkins',
    reporterUnit: 'Tower A - Flat 501',
    assignedDepartment: 'Elevator & Mechanical Maintenance',
    upvotes: 31,
    mapCoords: { x: 25, y: 35 },
    timeline: [
      {
        status: 'Submitted',
        label: 'Ticket Created',
        date: 'Jul 20, 2026, 04:12 PM'
      },
      {
        status: 'In Progress',
        label: 'Otis AMC Technician on Site',
        date: 'Jul 21, 2026, 09:00 AM',
        note: 'Guide rail lubricant serviced; replacing guide shoe assembly.'
      }
    ],
    comments: []
  },
  {
    id: 'URB-2026-1024',
    title: 'CCTV Camera #4 blind spot at visitor turnstile',
    category: 'Security',
    societyName: 'Elm Park Residency',
    address: 'Main Entrance Gate Security Cabin',
    description: 'Tree branch grew across the high-angle lens of camera 4, obscuring visitor car license plates upon entry.',
    status: 'Resolved',
    priority: 'Medium',
    date: 'Jul 18, 2026',
    timestamp: 1784332800000,
    photoUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    reporterName: 'Chief Security Officer',
    reporterUnit: 'Security Station 1',
    assignedDepartment: 'Security & Surveillance',
    upvotes: 11,
    mapCoords: { x: 50, y: 15 },
    timeline: [
      {
        status: 'Submitted',
        label: 'Logged',
        date: 'Jul 18, 2026, 07:30 AM'
      },
      {
        status: 'Resolved',
        label: 'Trimmed and Re-aimed',
        date: 'Jul 18, 2026, 02:00 PM',
        note: 'Gardening staff trimmed the overhanging branches and camera angle tested.'
      }
    ],
    comments: []
  }
];

export const CATEGORIES_CONFIG: Record<
  string,
  { label: string; iconEmoji: string; color: string; badgeBg: string; badgeText: string }
> = {
  Potholes: {
    label: 'Potholes',
    iconEmoji: '⚠️',
    color: 'text-amber-600',
    badgeBg: 'bg-amber-100/90',
    badgeText: 'text-amber-800'
  },
  Streetlights: {
    label: 'Streetlights',
    iconEmoji: '💡',
    color: 'text-yellow-600',
    badgeBg: 'bg-yellow-100/90',
    badgeText: 'text-yellow-800'
  },
  'Water Supply': {
    label: 'Water Supply',
    iconEmoji: '🚰',
    color: 'text-blue-600',
    badgeBg: 'bg-blue-100/90',
    badgeText: 'text-blue-800'
  },
  'Garbage & Waste': {
    label: 'Garbage & Waste',
    iconEmoji: '🗑️',
    color: 'text-emerald-600',
    badgeBg: 'bg-emerald-100/90',
    badgeText: 'text-emerald-800'
  },
  Electrical: {
    label: 'Electrical',
    iconEmoji: '⚡',
    color: 'text-orange-600',
    badgeBg: 'bg-orange-100/90',
    badgeText: 'text-orange-800'
  },
  Security: {
    label: 'Security',
    iconEmoji: '🛡️',
    color: 'text-indigo-600',
    badgeBg: 'bg-indigo-100/90',
    badgeText: 'text-indigo-800'
  },
  Elevator: {
    label: 'Elevator / Lift',
    iconEmoji: '🛗',
    color: 'text-purple-600',
    badgeBg: 'bg-purple-100/90',
    badgeText: 'text-purple-800'
  },
  'Parks & Gardens': {
    label: 'Parks & Gardens',
    iconEmoji: '🌳',
    color: 'text-green-600',
    badgeBg: 'bg-green-100/90',
    badgeText: 'text-green-800'
  },
  Drainage: {
    label: 'Drainage & Sewage',
    iconEmoji: '🌊',
    color: 'text-cyan-600',
    badgeBg: 'bg-cyan-100/90',
    badgeText: 'text-cyan-800'
  },
  Other: {
    label: 'General Maintenance',
    iconEmoji: '🔧',
    color: 'text-slate-600',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-800'
  }
};

export const POPULAR_SOCIETIES = [
  'Maple Heights Society',
  'Elm Park Residency',
  'Greenview Enclave',
  'Silver Oak Gardens',
  'Skyline Palms Housing Society',
  'Harmony Crest Apartments'
];

export const DEFAULT_MEMBER: UserProfile = {
  id: 'usr-member-402',
  role: 'member',
  name: 'Alex Morgan',
  email: 'alex.morgan@mapleheights.org',
  unit: 'Tower B - Flat 402',
  societyName: 'Maple Heights Society',
  designation: 'Verified Resident (Flat Owner)',
  phone: '+1 (555) 349-8291',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

export const DEFAULT_SECRETARY: UserProfile = {
  id: 'usr-sec-01',
  role: 'secretary',
  name: 'Arthur Sterling',
  email: 'secretary@mapleheights.org',
  unit: 'Estate Office #101',
  societyName: 'Maple Heights Society',
  designation: 'Hon. General Secretary & Estate Manager',
  phone: '+1 (555) 782-9011',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80',
};

export const INITIAL_NOTICES: SocietyNotice[] = [
  {
    id: 'not-1',
    title: 'Scheduled Water Booster Pump Maintenance',
    content: 'Scheduled water booster pump overhaul on Thursday, 10:00 AM – 1:00 PM for Blocks C & D. Please store adequate water in advance.',
    category: 'Maintenance',
    date: 'Sep 4, 2026',
    author: 'Arthur Sterling (Hon. Sec.)',
    urgent: true,
  },
  {
    id: 'not-2',
    title: '14th Annual General Body Meeting (AGM)',
    content: 'Notice is hereby given that the 14th AGM of Maple Heights Society will be held on Sunday, Sep 20 at 10:30 AM in the Clubhouse Banquet Hall.',
    category: 'Meeting',
    date: 'Sep 2, 2026',
    author: 'Managing Committee',
    urgent: false,
  },
  {
    id: 'not-3',
    title: 'EV Charging Bay Commissioning',
    content: 'Slots 5 to 8 in Basement B2 are now live for RFID charging card access. Contact the estate office to link your tag.',
    category: 'Security',
    date: 'Aug 28, 2026',
    author: 'Estate Management',
    urgent: false,
  }
];

export const INITIAL_FACILITIES: FacilityItem[] = [
  { id: 'f1', name: 'Main Swimming Pool', status: 'Open', hours: '6:00 AM - 9:00 PM' },
  { id: 'f2', name: 'Gymnasium & Fitness Club', status: 'Maintenance', hours: '5:30 AM - 10:00 PM' },
  { id: 'f3', name: 'Clubhouse Banquet Hall', status: 'Booked', hours: '9:00 AM - 11:00 PM', bookingFee: '$75/day' },
  { id: 'f4', name: 'Tennis & Pickleball Court', status: 'Open', hours: '6:00 AM - 8:00 PM' },
];
