import {
  UserProfile,
  CivicReport,
  PublicAlert,
  InAppNotification,
  AuditLog,
  Organization,
  Department,
  IssueCategory,
  UserRole,
  ReportStatus,
  PriorityLevel,
  AlertSeverity
} from '../types/civic';

const STORE_KEY = 'civicsync_v1_store_data';

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'usr_citizen_1',
    name: 'Maya Lin',
    email: 'maya.lin@example.com',
    demoEmail: 'demo.citizen@civicsync.local',
    demoPassword: 'CivicDemo!2026-Citizen',
    role: 'citizen',
    phone: '+1 (555) 234-8891',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    accountStatus: 'active',
    joinedAt: '2026-02-14T09:30:00Z'
  },
  {
    id: 'usr_admin_1',
    name: 'Director Marcus Vance',
    email: 'marcus.vance@metro.gov',
    demoEmail: 'demo.admin@civicsync.local',
    demoPassword: 'CivicDemo!2026-Admin',
    role: 'org_admin',
    organizationId: 'org_metro_pw',
    organizationName: 'Metro Department of Public Works',
    departmentId: 'dept_pw_ops',
    departmentName: 'Municipal Operations',
    phone: '+1 (555) 890-1122',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    accountStatus: 'active',
    joinedAt: '2025-06-10T08:00:00Z'
  },
  {
    id: 'usr_staff_1',
    name: 'Carlos Mendez',
    email: 'carlos.mendez@metro.gov',
    demoEmail: 'demo.field@civicsync.local',
    demoPassword: 'CivicDemo!2026-Field',
    role: 'field_staff',
    organizationId: 'org_metro_pw',
    organizationName: 'Metro Department of Public Works',
    departmentId: 'dept_roads',
    departmentName: 'Road & Bridge Maintenance',
    phone: '+1 (555) 431-7729',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    accountStatus: 'active',
    joinedAt: '2025-09-01T07:45:00Z'
  },
  {
    id: 'usr_super_1',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@civicsync.gov',
    demoEmail: 'demo.superadmin@civicsync.local',
    demoPassword: 'CivicDemo!2026-Super',
    role: 'super_admin',
    phone: '+1 (555) 991-0010',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    accountStatus: 'active',
    joinedAt: '2025-01-15T10:00:00Z'
  }
];

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'org_metro_pw',
    name: 'Metro Department of Public Works',
    type: 'Public Works',
    serviceArea: 'Greater Metropolitan Sector (Districts 1-6)',
    description: 'Responsible for road infrastructure, municipal lighting, stormwater mitigation, and civil maintenance.',
    status: 'active',
    contactEmail: 'operations@metro.gov',
    phone: '+1 (555) 890-1000',
    verifiedAt: '2025-06-01T00:00:00Z',
    adminCount: 3,
    staffCount: 28,
    activeReportsCount: 14
  },
  {
    id: 'org_water_auth',
    name: 'Metropolitan Water & Sanitation Authority',
    type: 'Water Authority',
    serviceArea: 'Metropolitan Basin & Riverfront Basin',
    description: 'Manages municipal drinking water distribution, wastewater conveyance, and watershed monitoring.',
    status: 'active',
    contactEmail: 'dispatch@metrowater.org',
    phone: '+1 (555) 778-9000',
    verifiedAt: '2025-08-12T00:00:00Z',
    adminCount: 2,
    staffCount: 19,
    activeReportsCount: 8
  },
  {
    id: 'org_city_transit',
    name: 'Valley Transportation & Signal Services',
    type: 'Transportation',
    serviceArea: 'High-density transit corridors and arterial routes',
    description: 'Maintains traffic signals, pedestrian walkways, bus lanes, and railway crossing safety elements.',
    status: 'pending',
    contactEmail: 'compliance@valleytransit.org',
    phone: '+1 (555) 332-4411',
    verifiedAt: '2026-10-15T00:00:00Z',
    adminCount: 1,
    staffCount: 12,
    activeReportsCount: 0
  }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept_roads',
    organizationId: 'org_metro_pw',
    name: 'Road & Bridge Maintenance',
    description: 'Pothole restoration, guardrail repair, asphalt resurfacing, and pavement safety.',
    activeStatus: true,
    staffCount: 12,
    contactLead: 'Supervisor Ronald Kelly'
  },
  {
    id: 'dept_lighting',
    organizationId: 'org_metro_pw',
    name: 'Municipal Electrical & Lighting',
    description: 'Streetlights, solar fixtures, signal illumination, and utility conduit safety.',
    activeStatus: true,
    staffCount: 8,
    contactLead: 'Engineer Sarah Sterling'
  },
  {
    id: 'dept_sanitation',
    organizationId: 'org_metro_pw',
    name: 'Waste & Sanitation Logistics',
    description: 'Civic bins, bulk refuse clearing, street sweeping, and illegal dumping mitigation.',
    activeStatus: true,
    staffCount: 10,
    contactLead: 'Coordinator David Brooks'
  },
  {
    id: 'dept_water_dist',
    organizationId: 'org_water_auth',
    name: 'Water Distribution & Main Repair',
    description: 'Pressurized water mains, fire hydrant maintenance, and leakage response.',
    activeStatus: true,
    staffCount: 11,
    contactLead: 'Inspector Karen Choi'
  }
];

export const INITIAL_CATEGORIES: IssueCategory[] = [
  {
    id: 'cat_roads',
    name: 'Roads & Potholes',
    slug: 'roads-potholes',
    description: 'Damaged pavement, sinkholes, road debris, and guardrail compromise.',
    icon: 'Hammer',
    defaultDepartmentName: 'Road & Bridge Maintenance',
    activeStatus: true,
    slaHours: 48
  },
  {
    id: 'cat_streetlights',
    name: 'Streetlights & Electrical',
    slug: 'streetlights',
    description: 'Dark roadway segments, knocked-over poles, flickering luminaires, and exposed wires.',
    icon: 'Lightbulb',
    defaultDepartmentName: 'Municipal Electrical & Lighting',
    activeStatus: true,
    slaHours: 24
  },
  {
    id: 'cat_waste',
    name: 'Waste Management & Litter',
    slug: 'waste-management',
    description: 'Overflowing public bins, unauthorized dumping, hazardous refuse, and street trash.',
    icon: 'Trash2',
    defaultDepartmentName: 'Waste & Sanitation Logistics',
    activeStatus: true,
    slaHours: 24
  },
  {
    id: 'cat_drainage',
    name: 'Drainage & Storm Flooding',
    slug: 'drainage-sanitation',
    description: 'Clogged catch basins, storm grate debris, surface pooling, and sewer backflow.',
    icon: 'Waves',
    defaultDepartmentName: 'Road & Bridge Maintenance',
    activeStatus: true,
    slaHours: 36
  },
  {
    id: 'cat_water',
    name: 'Water Supply & Hydrants',
    slug: 'water-supply',
    description: 'Broken main leaks, low water pressure, discolored water, and leaking fire hydrants.',
    icon: 'Droplets',
    defaultDepartmentName: 'Water Distribution & Main Repair',
    activeStatus: true,
    slaHours: 12
  },
  {
    id: 'cat_infrastructure',
    name: 'Public Infrastructure & Parks',
    slug: 'public-infrastructure',
    description: 'Damaged sidewalks, fallen tree limbs on pathways, broken park benches, and fence breaches.',
    icon: 'Building2',
    defaultDepartmentName: 'Municipal Operations',
    activeStatus: true,
    slaHours: 72
  }
];

export const INITIAL_REPORTS: CivicReport[] = [
  {
    id: 'rep_101',
    reportNumber: 'REP-2026-8814',
    title: 'Deep asphalt pothole near Lincoln Elementary crossing',
    description: 'Large fissure approximately 14 inches wide and 4 inches deep on the eastbound lane. Vehicles are swerving into oncoming traffic to avoid rim damage during school drop-off hours.',
    categoryId: 'cat_roads',
    categoryName: 'Roads & Potholes',
    status: 'in_progress',
    priority: 'urgent',
    location: {
      address: '742 Lincoln Blvd & 8th Street',
      landmark: 'Directly in front of Lincoln Elementary School pedestrian crosswalk',
      lat: 37.7749,
      lng: -122.4194,
      district: 'Central Metro District'
    },
    submittedBy: {
      id: 'usr_citizen_1',
      name: 'Maya Lin',
      email: 'maya.lin@example.com'
    },
    organizationId: 'org_metro_pw',
    organizationName: 'Metro Department of Public Works',
    departmentId: 'dept_roads',
    departmentName: 'Road & Bridge Maintenance',
    assignedStaff: {
      id: 'usr_staff_1',
      name: 'Carlos Mendez',
      role: 'Rapid Response Crew Lead',
      assignedAt: '2026-10-26T09:15:00Z',
      departmentName: 'Road & Bridge Maintenance'
    },
    assignmentInstructions: 'Deploy cold-mix patch crew immediately due to school zone proximity. Place high-visibility warning cones during preparation.',
    targetCompletionDate: '2026-10-27T18:00:00Z',
    evidence: [
      {
        id: 'ev_1',
        url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
        type: 'initial',
        caption: 'Initial citizen photo showing tire strike risk at pedestrian crossing',
        uploadedBy: 'Maya Lin',
        uploadedAt: '2026-10-25T14:20:00Z'
      },
      {
        id: 'ev_2',
        url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80',
        type: 'progress',
        caption: 'Field crew arrived on site, marked perimeter with safety cones and prepared hot bitumen binder',
        uploadedBy: 'Carlos Mendez',
        uploadedAt: '2026-10-26T11:00:00Z'
      }
    ],
    workPerformedNotes: 'Crew arrived at 10:45 AM. Perimeter cleared, moisture evacuated, hot asphalt compaction underway.',
    materialsUsed: '250kg Hot Mix Asphalt, Bituminous Tack Coat, Class 2 Safety Barriers',
    timeline: [
      {
        id: 'tl_1',
        status: 'submitted',
        title: 'Report Registered',
        note: 'Report submitted via CivicSync Citizen Portal with geo-coordinates and high-resolution photo.',
        actorName: 'Maya Lin',
        actorRole: 'citizen',
        timestamp: '2026-10-25T14:20:00Z'
      },
      {
        id: 'tl_2',
        status: 'under_review',
        title: 'Municipal Intake Assessment',
        note: 'Triaged and verified by Operations Desk. Elevated to Urgent due to school pedestrian corridor.',
        actorName: 'Director Marcus Vance',
        actorRole: 'org_admin',
        timestamp: '2026-10-26T08:30:00Z'
      },
      {
        id: 'tl_3',
        status: 'assigned',
        title: 'Dispatched to Rapid Response',
        note: 'Assigned to Carlos Mendez (Road & Bridge Maintenance). SLA target set for 24-hour turnaround.',
        actorName: 'Director Marcus Vance',
        actorRole: 'org_admin',
        timestamp: '2026-10-26T09:15:00Z'
      },
      {
        id: 'tl_4',
        status: 'in_progress',
        title: 'On-Site Work Commenced',
        note: 'Field crew logged on-site arrival. Safety perimeter deployed, excavation of fractured edges initiated.',
        actorName: 'Carlos Mendez',
        actorRole: 'field_staff',
        timestamp: '2026-10-26T11:00:00Z'
      }
    ],
    createdAt: '2026-10-25T14:20:00Z',
    updatedAt: '2026-10-26T11:00:00Z'
  },
  {
    id: 'rep_102',
    reportNumber: 'REP-2026-8815',
    title: 'Severe storm drain blockage causing standing water at intersection',
    description: 'Grates completely covered in compressed autumn leaves and construction sediment. Heavy rain caused a 15-meter ponding water puddle covering the pedestrian ramp.',
    categoryId: 'cat_drainage',
    categoryName: 'Drainage & Storm Flooding',
    status: 'awaiting_verification',
    priority: 'high',
    location: {
      address: 'Market St & 14th Ave',
      landmark: 'Southwest corner opposite City Library entrance',
      lat: 37.7699,
      lng: -122.4211,
      district: 'Central Metro District'
    },
    submittedBy: {
      id: 'usr_citizen_1',
      name: 'Maya Lin',
      email: 'maya.lin@example.com'
    },
    organizationId: 'org_metro_pw',
    organizationName: 'Metro Department of Public Works',
    departmentId: 'dept_roads',
    departmentName: 'Road & Bridge Maintenance',
    assignedStaff: {
      id: 'usr_staff_1',
      name: 'Carlos Mendez',
      role: 'Rapid Response Crew Lead',
      assignedAt: '2026-10-24T10:00:00Z',
      departmentName: 'Road & Bridge Maintenance'
    },
    assignmentInstructions: 'Clear sediment and verify subterranean pipe flow using vacuum suction vehicle.',
    targetCompletionDate: '2026-10-25T16:00:00Z',
    evidence: [
      {
        id: 'ev_3',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80',
        type: 'initial',
        caption: 'Submerged drain grate with flooded pedestrian sidewalk ramp',
        uploadedBy: 'Maya Lin',
        uploadedAt: '2026-10-23T16:45:00Z'
      },
      {
        id: 'ev_4',
        url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
        type: 'resolution_after',
        caption: 'Cleared grate, extracted 80kg silt, verified unobstructed gravity discharge into main conduit',
        uploadedBy: 'Carlos Mendez',
        uploadedAt: '2026-10-25T15:20:00Z'
      }
    ],
    workPerformedNotes: 'Utilized industrial jet-vac unit. Extracted organic blockage down to 3 meters. Flow test completed at 100 gallons/min with zero pooling.',
    timeline: [
      {
        id: 'tl_11',
        status: 'submitted',
        title: 'Report Registered',
        actorName: 'Maya Lin',
        actorRole: 'citizen',
        timestamp: '2026-10-23T16:45:00Z'
      },
      {
        id: 'tl_12',
        status: 'under_review',
        title: 'Approved for Drainage Ops',
        actorName: 'Director Marcus Vance',
        actorRole: 'org_admin',
        timestamp: '2026-10-24T09:00:00Z'
      },
      {
        id: 'tl_13',
        status: 'assigned',
        title: 'Dispatched to Carlos Mendez',
        actorName: 'Director Marcus Vance',
        actorRole: 'org_admin',
        timestamp: '2026-10-24T10:00:00Z'
      },
      {
        id: 'tl_14',
        status: 'in_progress',
        title: 'Jet-Vac Crew On Site',
        actorName: 'Carlos Mendez',
        actorRole: 'field_staff',
        timestamp: '2026-10-25T13:30:00Z'
      },
      {
        id: 'tl_15',
        status: 'awaiting_verification',
        title: 'Work Completed — Awaiting Supervisor Sign-off',
        note: 'Field staff uploaded after-photos and water flow test documentation.',
        actorName: 'Carlos Mendez',
        actorRole: 'field_staff',
        timestamp: '2026-10-25T15:30:00Z'
      }
    ],
    createdAt: '2026-10-23T16:45:00Z',
    updatedAt: '2026-10-25T15:30:00Z'
  },
  {
    id: 'rep_103',
    reportNumber: 'REP-2026-8816',
    title: 'Broken LED luminaire fixture flickering rapidly on Elm Avenue',
    description: 'Streetlight pole #ELM-402 strobes at high frequency at night, causing disorientation for drivers and disturbing adjacent residential apartments.',
    categoryId: 'cat_streetlights',
    categoryName: 'Streetlights & Electrical',
    status: 'under_review',
    priority: 'medium',
    location: {
      address: '320 Elm Avenue',
      landmark: 'Near Elm Park north gazebo',
      lat: 37.7833,
      lng: -122.4167,
      district: 'Northside Parkside'
    },
    submittedBy: {
      id: 'usr_citizen_1',
      name: 'Maya Lin',
      email: 'maya.lin@example.com'
    },
    organizationId: 'org_metro_pw',
    organizationName: 'Metro Department of Public Works',
    departmentId: 'dept_lighting',
    departmentName: 'Municipal Electrical & Lighting',
    evidence: [
      {
        id: 'ev_5',
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
        type: 'initial',
        caption: 'Nighttime photo of malfunctioning fixture pole #ELM-402',
        uploadedBy: 'Maya Lin',
        uploadedAt: '2026-10-26T21:10:00Z'
      }
    ],
    timeline: [
      {
        id: 'tl_21',
        status: 'submitted',
        title: 'Report Registered',
        actorName: 'Maya Lin',
        actorRole: 'citizen',
        timestamp: '2026-10-26T21:10:00Z'
      },
      {
        id: 'tl_22',
        status: 'under_review',
        title: 'Queue Intake Pending Department Lead Assignment',
        note: 'Verified address against GIS municipal lighting asset registry.',
        actorName: 'Director Marcus Vance',
        actorRole: 'org_admin',
        timestamp: '2026-10-27T06:30:00Z'
      }
    ],
    createdAt: '2026-10-26T21:10:00Z',
    updatedAt: '2026-10-27T06:30:00Z'
  },
  {
    id: 'rep_104',
    reportNumber: 'REP-2026-8817',
    title: 'Overflowing recycling station in Riverfront Promenade',
    description: 'Three recycling bins completely packed beyond capacity with cardboard boxes and aluminum cans spilling onto grass area.',
    categoryId: 'cat_waste',
    categoryName: 'Waste Management & Litter',
    status: 'resolved',
    priority: 'medium',
    location: {
      address: '88 Riverfront Walkway',
      landmark: 'Next to Waterfront Marina Pier 2',
      lat: 37.7952,
      lng: -122.3934,
      district: 'Harbor District'
    },
    submittedBy: {
      id: 'usr_citizen_1',
      name: 'Maya Lin',
      email: 'maya.lin@example.com'
    },
    organizationId: 'org_metro_pw',
    organizationName: 'Metro Department of Public Works',
    departmentId: 'dept_sanitation',
    departmentName: 'Waste & Sanitation Logistics',
    assignedStaff: {
      id: 'usr_staff_2',
      name: 'Samira Patel',
      role: 'Sanitation Dispatch Tech',
      assignedAt: '2026-10-22T08:00:00Z',
      departmentName: 'Waste & Sanitation Logistics'
    },
    evidence: [
      {
        id: 'ev_6',
        url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
        type: 'initial',
        caption: 'Overloaded collection station',
        uploadedBy: 'Maya Lin',
        uploadedAt: '2026-10-21T18:00:00Z'
      },
      {
        id: 'ev_7',
        url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
        type: 'resolution_after',
        caption: 'Empty bins, swept perimeter, installed additional capacity bag',
        uploadedBy: 'Samira Patel',
        uploadedAt: '2026-10-22T14:15:00Z'
      }
    ],
    workPerformedNotes: 'Cleared 3 bins, power-washed surrounding concrete slab, installed heavy-duty recycled liner.',
    resolutionVerification: {
      verifiedBy: 'Director Marcus Vance',
      verifiedAt: '2026-10-22T16:00:00Z',
      decision: 'approved',
      notes: 'Clean verification confirmed. Site restored to public standard.'
    },
    citizenFeedback: {
      confirmedResolved: true,
      satisfactionRating: 5,
      comment: 'Very rapid response and clean cleanup. Thank you!',
      confirmedAt: '2026-10-23T09:00:00Z'
    },
    timeline: [
      {
        id: 'tl_31',
        status: 'submitted',
        title: 'Report Registered',
        actorName: 'Maya Lin',
        actorRole: 'citizen',
        timestamp: '2026-10-21T18:00:00Z'
      },
      {
        id: 'tl_32',
        status: 'assigned',
        title: 'Assigned to Sanitation Logistics',
        actorName: 'Director Marcus Vance',
        actorRole: 'org_admin',
        timestamp: '2026-10-22T08:00:00Z'
      },
      {
        id: 'tl_33',
        status: 'resolved',
        title: 'Resolution Verified & Closed',
        actorName: 'Director Marcus Vance',
        actorRole: 'org_admin',
        timestamp: '2026-10-22T16:00:00Z'
      }
    ],
    createdAt: '2026-10-21T18:00:00Z',
    updatedAt: '2026-10-23T09:00:00Z',
    resolvedAt: '2026-10-22T16:00:00Z',
    closedAt: '2026-10-23T09:00:00Z'
  }
];

export const INITIAL_ALERTS: PublicAlert[] = [
  {
    id: 'alt_1',
    alertNumber: 'ALT-2026-402',
    title: 'Flash Flood & Stormwater Surcharge Warning for Riverfront District',
    description: 'Meteorological sensors forecast 2.5 inches of precipitation in under 3 hours. Low-lying basements along Riverfront Way and Commercial Quay are urged to deploy sandbags. Storm drain teams are mobilized on standby.',
    category: 'Severe Weather & Drainage',
    severity: 'warning',
    issuingOrgId: 'org_metro_pw',
    issuingOrgName: 'Metro Department of Public Works',
    publicationStatus: 'published',
    affectedArea: 'Riverfront Corridor, 1st to 9th Avenues along River Pier',
    coordinates: {
      lat: 37.7952,
      lng: -122.3934,
      radiusKm: 3.5
    },
    instructions: [
      'Avoid parking low-clearance vehicles in sub-grade parking structures along Riverfront Way.',
      'Report active street catch-basin blockages directly via CivicSync.',
      'Never drive through pooled or moving water deeper than 6 inches.'
    ],
    publishedAt: '2026-10-26T16:00:00Z',
    expiresAt: '2026-10-28T22:00:00Z',
    createdBy: 'Director Marcus Vance',
    savedByUsers: ['usr_citizen_1']
  },
  {
    id: 'alt_2',
    alertNumber: 'ALT-2026-403',
    title: 'Scheduled Water Main Pressure Reduction & Flush on Highland Corridor',
    description: 'Routine maintenance and valve replacement on the 24-inch Highland arterial transmission pipe. Residents may experience temporary discoloration or reduced pressure.',
    category: 'Municipal Utilities',
    severity: 'advisory',
    issuingOrgId: 'org_water_auth',
    issuingOrgName: 'Metropolitan Water & Sanitation Authority',
    publicationStatus: 'published',
    affectedArea: 'Highland Park, Ridgecrest Sector, Blocks 400-800',
    coordinates: {
      lat: 37.7712,
      lng: -122.4467,
      radiusKm: 2.0
    },
    instructions: [
      'Run cold taps for 60 seconds if initial water draws exhibit slight mineral cloudiness.',
      'Boil water is NOT required; supply remains fully disinfected and bacteriologically safe.',
      'Work scheduled from 10:00 PM to 05:00 AM to minimize business interruption.'
    ],
    publishedAt: '2026-10-25T10:00:00Z',
    expiresAt: '2026-10-29T12:00:00Z',
    createdBy: 'Inspector Karen Choi',
    savedByUsers: []
  },
  {
    id: 'alt_3',
    alertNumber: 'ALT-2026-404',
    title: 'Emergency Gas Line Replacement: Lane Closure on 4th & Market',
    description: 'Subsurface gas pressure anomaly identified during utility trench inspection. Northbound lanes on 4th Street closed between Market and Mission. Emergency perimeter active.',
    category: 'Public Safety & Transit',
    severity: 'emergency',
    issuingOrgId: 'org_metro_pw',
    issuingOrgName: 'Metro Department of Public Works',
    publicationStatus: 'published',
    affectedArea: 'Intersection of 4th Street & Market Street (1-block safety perimeter)',
    coordinates: {
      lat: 37.7858,
      lng: -122.4065,
      radiusKm: 0.8
    },
    instructions: [
      'All commercial and commuter vehicles must detour via 2nd Street or 6th Street.',
      'Pedestrians are diverted through the covered east walkway.',
      'Follow illuminated traffic variable-message signage and field officer directions.'
    ],
    publishedAt: '2026-10-27T04:30:00Z',
    expiresAt: '2026-10-27T23:59:00Z',
    createdBy: 'Director Marcus Vance',
    savedByUsers: ['usr_citizen_1']
  }
];

export const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif_1',
    recipientUserId: 'usr_citizen_1',
    recipientRole: 'citizen',
    type: 'report_status',
    title: 'Work Commenced on Pothole (REP-2026-8814)',
    message: 'Field technician Carlos Mendez arrived on site at Lincoln Blvd with hot-mix repair crew.',
    relatedEntityId: 'rep_101',
    relatedEntityType: 'report',
    read: false,
    createdAt: '2026-10-26T11:05:00Z'
  },
  {
    id: 'notif_2',
    recipientUserId: 'usr_citizen_1',
    recipientRole: 'citizen',
    type: 'alert',
    title: 'Urgent Weather Warning: Riverfront District',
    message: 'Metro Public Works issued a flash flood warning for low-lying zones in your area.',
    relatedEntityId: 'alt_1',
    relatedEntityType: 'alert',
    read: true,
    createdAt: '2026-10-26T16:02:00Z'
  },
  {
    id: 'notif_3',
    recipientUserId: 'usr_staff_1',
    recipientRole: 'field_staff',
    type: 'assignment',
    title: 'New Urgent Priority Assignment: REP-2026-8814',
    message: 'Director Vance assigned you Lincoln Elementary school crossing pothole restoration.',
    relatedEntityId: 'rep_101',
    relatedEntityType: 'report',
    read: true,
    createdAt: '2026-10-26T09:16:00Z'
  },
  {
    id: 'notif_4',
    recipientUserId: 'usr_admin_1',
    recipientRole: 'org_admin',
    type: 'verification',
    title: 'Work Awaiting Sign-off: REP-2026-8815',
    message: 'Carlos Mendez submitted completion evidence for Market & 14th Ave drainage clearing.',
    relatedEntityId: 'rep_102',
    relatedEntityType: 'report',
    read: false,
    createdAt: '2026-10-25T15:35:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_1',
    actorId: 'usr_admin_1',
    actorName: 'Director Marcus Vance',
    actorRole: 'org_admin',
    organizationId: 'org_metro_pw',
    organizationName: 'Metro Department of Public Works',
    action: 'DISPATCH_ASSIGNMENT',
    targetType: 'report',
    targetId: 'rep_101',
    details: 'Assigned report REP-2026-8814 to Carlos Mendez with Priority=Urgent and SLA=24h',
    severity: 'info',
    timestamp: '2026-10-26T09:15:00Z'
  },
  {
    id: 'aud_2',
    actorId: 'usr_admin_1',
    actorName: 'Director Marcus Vance',
    actorRole: 'org_admin',
    organizationId: 'org_metro_pw',
    organizationName: 'Metro Department of Public Works',
    action: 'PUBLISH_ALERT',
    targetType: 'alert',
    targetId: 'alt_1',
    details: 'Published official public safety alert ALT-2026-402 (Severity=Warning, Area=Riverfront Corridor)',
    severity: 'warning',
    timestamp: '2026-10-26T16:00:00Z'
  },
  {
    id: 'aud_3',
    actorId: 'usr_staff_1',
    actorName: 'Carlos Mendez',
    actorRole: 'field_staff',
    organizationId: 'org_metro_pw',
    organizationName: 'Metro Department of Public Works',
    action: 'SUBMIT_RESOLUTION_EVIDENCE',
    targetType: 'report',
    targetId: 'rep_102',
    details: 'Uploaded jet-vac cleaning evidence photo and flow certification for drain REP-2026-8815',
    severity: 'info',
    timestamp: '2026-10-25T15:25:00Z'
  },
  {
    id: 'aud_4',
    actorId: 'usr_super_1',
    actorName: 'Dr. Elena Rostova',
    actorRole: 'super_admin',
    action: 'ORGANIZATION_ONBOARDING_VERIFIED',
    targetType: 'organization',
    targetId: 'org_metro_pw',
    details: 'Re-certified municipal compliance and delegated domain authority for metro.gov',
    severity: 'info',
    timestamp: '2026-10-20T11:00:00Z'
  }
];

export interface CivicSyncState {
  users: UserProfile[];
  organizations: Organization[];
  departments: Department[];
  categories: IssueCategory[];
  reports: CivicReport[];
  alerts: PublicAlert[];
  notifications: InAppNotification[];
  auditLogs: AuditLog[];
  currentUserId: string;
}

class CivicSyncStore {
  private state: CivicSyncState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): CivicSyncState {
    try {
      const serialized = localStorage.getItem(STORE_KEY);
      if (serialized) {
        const parsed = JSON.parse(serialized);
        // Ensure initial entities exist if schema evolved
        if (parsed && Array.isArray(parsed.reports) && parsed.reports.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to fresh seed
    }

    const initial: CivicSyncState = {
      users: DEMO_USERS,
      organizations: INITIAL_ORGANIZATIONS,
      departments: INITIAL_DEPARTMENTS,
      categories: INITIAL_CATEGORIES,
      reports: INITIAL_REPORTS,
      alerts: INITIAL_ALERTS,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
      currentUserId: 'usr_citizen_1' // Maya Lin by default
    };
    this.persist(initial);
    return initial;
  }

  private persist(state: CivicSyncState) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.persist(this.state);
    this.listeners.forEach((fn) => fn());
  }

  public getState(): CivicSyncState {
    return this.state;
  }

  public resetToSampleData(): void {
    const initial: CivicSyncState = {
      users: DEMO_USERS,
      organizations: INITIAL_ORGANIZATIONS,
      departments: INITIAL_DEPARTMENTS,
      categories: INITIAL_CATEGORIES,
      reports: INITIAL_REPORTS,
      alerts: INITIAL_ALERTS,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
      currentUserId: 'usr_citizen_1'
    };
    this.state = initial;
    this.notify();
  }

  
  public authenticate(email: string, password: string, requiredRole?: UserRole): UserProfile {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const user = this.state.users.find((u) => {
      const matchPrimary = u.email.toLowerCase() === cleanEmail;
      const matchDemo = u.demoEmail && u.demoEmail.toLowerCase() === cleanEmail;
      return matchPrimary || matchDemo;
    });

    if (!user) {
      throw new Error('Account not found with this email address.');
    }

    if (user.accountStatus === 'suspended') {
      throw new Error('Account is suspended. Contact municipal governance administrator.');
    }

    if (requiredRole && user.role !== requiredRole) {
      throw new Error();
    }

    if (user.demoPassword && cleanPass === user.demoPassword) {
      // Demo password matched
      this.state.currentUserId = user.id;
      this.notify();
      return user;
    }

    // Default password acceptance in development environment
    if (cleanPass.length >= 6) {
      this.state.currentUserId = user.id;
      this.notify();
      return user;
    }

    throw new Error('Invalid password provided.');
  }

  public getCurrentUser(): UserProfile {
    return this.state.users.find((u) => u.id === this.state.currentUserId) || this.state.users[0];
  }

  public setCurrentUser(userId: string): void {
    const user = this.state.users.find((u) => u.id === userId);
    if (user) {
      this.state.currentUserId = userId;
      this.notify();
    }
  }

  public registerCitizen(name: string, email: string, phone?: string): UserProfile {
    const existing = this.state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }
    const newUser: UserProfile = {
      id: `usr_citizen_${Date.now()}`,
      name,
      email,
      role: 'citizen',
      phone: phone || '',
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=176b52`,
      accountStatus: 'active',
      joinedAt: new Date().toISOString()
    };
    this.state.users.push(newUser);
    this.state.currentUserId = newUser.id;

    this.recordAudit({
      actorId: newUser.id,
      actorName: newUser.name,
      actorRole: 'citizen',
      action: 'CITIZEN_REGISTRATION',
      targetType: 'user',
      targetId: newUser.id,
      details: `Citizen account registered for ${name} (${email})`
    });

    this.notify();
    return newUser;
  }

  // --- REPORT LIFECYCLE ---

  public createReport(data: {
    title: string;
    description: string;
    categoryId: string;
    address: string;
    landmark?: string;
    lat: number;
    lng: number;
    district: string;
    priority?: PriorityLevel;
    evidencePhotoUrl?: string;
    caption?: string;
  }): CivicReport {
    const user = this.getCurrentUser();
    const cat = this.state.categories.find((c) => c.id === data.categoryId);
    const reportNum = `REP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newReport: CivicReport = {
      id: `rep_${Date.now()}`,
      reportNumber: reportNum,
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
      categoryName: cat?.name || 'Civic Infrastructure',
      status: 'submitted',
      priority: data.priority || 'medium',
      location: {
        address: data.address,
        landmark: data.landmark,
        lat: data.lat,
        lng: data.lng,
        district: data.district || 'Central District'
      },
      submittedBy: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      organizationId: 'org_metro_pw',
      organizationName: 'Metro Department of Public Works',
      evidence: data.evidencePhotoUrl
        ? [
            {
              id: `ev_${Date.now()}`,
              url: data.evidencePhotoUrl,
              type: 'initial',
              caption: data.caption || 'Citizen report attachment',
              uploadedBy: user.name,
              uploadedAt: now
            }
          ]
        : [],
      timeline: [
        {
          id: `tl_${Date.now()}`,
          status: 'submitted',
          title: 'Report Submitted',
          note: 'Submitted with location coordinates and priority context.',
          actorName: user.name,
          actorRole: user.role,
          timestamp: now
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    this.state.reports.unshift(newReport);

    // Notify organization administrators
    this.createNotification({
      recipientUserId: 'usr_admin_1',
      recipientRole: 'org_admin',
      type: 'report_status',
      title: `New Report: ${newReport.reportNumber}`,
      message: `${data.title} in ${data.district} submitted and awaiting operational review.`,
      relatedEntityId: newReport.id,
      relatedEntityType: 'report'
    });

    // Notify submitting citizen
    this.createNotification({
      recipientUserId: user.id,
      recipientRole: 'citizen',
      type: 'report_status',
      title: `Report Registered: ${newReport.reportNumber}`,
      message: `Your report "${data.title}" was successfully recorded and submitted to municipal triage.`,
      relatedEntityId: newReport.id,
      relatedEntityType: 'report'
    });

    this.recordAudit({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      organizationId: 'org_metro_pw',
      action: 'SUBMIT_REPORT',
      targetType: 'report',
      targetId: newReport.id,
      details: `Created civic report ${newReport.reportNumber} (${cat?.name})`
    });

    this.notify();
    return newReport;
  }

  public checkPossibleDuplicates(categoryId: string, lat: number, lng: number, title: string): CivicReport[] {
    // Deterministic duplicate check: within ~1 km distance and matching category or title words
    return this.state.reports.filter((r) => {
      if (r.status === 'resolved' || r.status === 'closed') return false;
      const dLat = Math.abs(r.location.lat - lat);
      const dLng = Math.abs(r.location.lng - lng);
      // rough distance threshold approx 0.01 degrees (~1km)
      const isNearby = dLat < 0.015 && dLng < 0.015;
      const isSameCategory = r.categoryId === categoryId;
      const wordsA = title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const wordsB = r.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const hasSharedKeyword = wordsA.some(w => wordsB.includes(w));

      return (isNearby && isSameCategory) || (isNearby && hasSharedKeyword);
    });
  }

  public reviewReport(
    reportId: string,
    decision: 'approve' | 'reject' | 'request_info',
    notes: string,
    departmentId?: string
  ): void {
    const user = this.getCurrentUser();
    const report = this.state.reports.find((r) => r.id === reportId);
    if (!report) throw new Error('Report not found');

    const now = new Date().toISOString();
    let nextStatus: ReportStatus = report.status;
    let eventTitle = '';

    if (decision === 'approve') {
      nextStatus = 'under_review';
      eventTitle = 'Intake Approved for Operations';
      if (departmentId) {
        const dept = this.state.departments.find((d) => d.id === departmentId);
        if (dept) {
          report.departmentId = dept.id;
          report.departmentName = dept.name;
        }
      }
    } else if (decision === 'reject') {
      nextStatus = 'rejected';
      eventTitle = 'Report Rejected';
      report.rejectionReason = notes;
    } else if (decision === 'request_info') {
      nextStatus = 'more_info_required';
      eventTitle = 'Additional Clarification Requested';
      report.moreInfoRequestedNotes = notes;
    }

    report.status = nextStatus;
    report.updatedAt = now;
    report.timeline.push({
      id: `tl_${Date.now()}`,
      status: nextStatus,
      title: eventTitle,
      note: notes,
      actorName: user.name,
      actorRole: user.role,
      timestamp: now
    });

    // Notify Submitting Citizen
    this.createNotification({
      recipientUserId: report.submittedBy.id,
      recipientRole: 'citizen',
      type: 'report_status',
      title: `${report.reportNumber}: ${eventTitle}`,
      message: notes,
      relatedEntityId: report.id,
      relatedEntityType: 'report'
    });

    this.recordAudit({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      organizationId: report.organizationId,
      action: `REVIEW_${decision.toUpperCase()}`,
      targetType: 'report',
      targetId: report.id,
      details: `${decision.toUpperCase()}: ${notes}`
    });

    this.notify();
  }

  public submitCitizenMoreInfo(reportId: string, citizenResponse: string): void {
    const user = this.getCurrentUser();
    const report = this.state.reports.find((r) => r.id === reportId);
    if (!report) throw new Error('Report not found');

    const now = new Date().toISOString();
    report.status = 'under_review';
    report.citizenMoreInfoResponse = citizenResponse;
    report.updatedAt = now;
    report.timeline.push({
      id: `tl_${Date.now()}`,
      status: 'under_review',
      title: 'Citizen Provided Requested Information',
      note: citizenResponse,
      actorName: user.name,
      actorRole: user.role,
      timestamp: now
    });

    // Notify Admin
    this.createNotification({
      recipientUserId: 'usr_admin_1',
      recipientRole: 'org_admin',
      type: 'report_status',
      title: `Response Received for ${report.reportNumber}`,
      message: `${user.name} responded: "${citizenResponse.slice(0, 100)}..."`,
      relatedEntityId: report.id,
      relatedEntityType: 'report'
    });

    this.notify();
  }

  public assignReport(data: {
    reportId: string;
    staffId: string;
    departmentId: string;
    instructions: string;
    priority: PriorityLevel;
    targetCompletionDate?: string;
  }): void {
    const user = this.getCurrentUser();
    const report = this.state.reports.find((r) => r.id === data.reportId);
    if (!report) throw new Error('Report not found');

    const staff = this.state.users.find((u) => u.id === data.staffId);
    if (!staff) throw new Error('Staff member not found');

    const dept = this.state.departments.find((d) => d.id === data.departmentId);
    const now = new Date().toISOString();

    report.status = 'assigned';
    report.priority = data.priority;
    report.departmentId = data.departmentId;
    report.departmentName = dept?.name || report.departmentName;
    report.assignedStaff = {
      id: staff.id,
      name: staff.name,
      role: staff.role === 'field_staff' ? 'Field Response Specialist' : 'Operations Specialist',
      assignedAt: now,
      departmentName: dept?.name || 'Municipal Works'
    };
    report.assignmentInstructions = data.instructions;
    report.targetCompletionDate = data.targetCompletionDate;
    report.updatedAt = now;

    report.timeline.push({
      id: `tl_${Date.now()}`,
      status: 'assigned',
      title: `Assigned to ${staff.name}`,
      note: data.instructions,
      actorName: user.name,
      actorRole: user.role,
      timestamp: now
    });

    // Notify assigned staff
    this.createNotification({
      recipientUserId: staff.id,
      recipientRole: 'field_staff',
      type: 'assignment',
      title: `Task Assigned: ${report.reportNumber}`,
      message: `Priority: ${data.priority.toUpperCase()}. ${data.instructions}`,
      relatedEntityId: report.id,
      relatedEntityType: 'report'
    });

    // Notify citizen
    this.createNotification({
      recipientUserId: report.submittedBy.id,
      recipientRole: 'citizen',
      type: 'report_status',
      title: `Crew Assigned to ${report.reportNumber}`,
      message: `Assigned to ${staff.name} (${dept?.name || 'Public Works'}). Target completion: ${data.targetCompletionDate ? new Date(data.targetCompletionDate).toLocaleDateString() : 'Within standard SLA'}.`,
      relatedEntityId: report.id,
      relatedEntityType: 'report'
    });

    this.recordAudit({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      organizationId: report.organizationId,
      action: 'ASSIGN_STAFF',
      targetType: 'report',
      targetId: report.id,
      details: `Assigned to ${staff.name} with target date ${data.targetCompletionDate || 'N/A'}`
    });

    this.notify();
  }

  public updateFieldProgress(data: {
    reportId: string;
    newStatus: 'in_progress' | 'on_hold';
    notes: string;
    delayReason?: string;
  }): void {
    const user = this.getCurrentUser();
    const report = this.state.reports.find((r) => r.id === data.reportId);
    if (!report) throw new Error('Report not found');

    const now = new Date().toISOString();
    report.status = data.newStatus;
    report.workPerformedNotes = data.notes;
    report.updatedAt = now;

    report.timeline.push({
      id: `tl_${Date.now()}`,
      status: data.newStatus,
      title: data.newStatus === 'in_progress' ? 'Work In Progress' : 'Task Placed On Hold',
      note: data.delayReason ? `On Hold Reason: ${data.delayReason}. ${data.notes}` : data.notes,
      actorName: user.name,
      actorRole: user.role,
      timestamp: now
    });

    // Notify Citizen
    this.createNotification({
      recipientUserId: report.submittedBy.id,
      recipientRole: 'citizen',
      type: 'report_status',
      title: `Update on ${report.reportNumber}`,
      message: data.newStatus === 'in_progress' ? `Field crew has started on-site work: "${data.notes}"` : `Work temporarily delayed: ${data.delayReason}`,
      relatedEntityId: report.id,
      relatedEntityType: 'report'
    });

    this.notify();
  }

  public submitFieldResolution(data: {
    reportId: string;
    workPerformed: string;
    materialsUsed?: string;
    beforePhotoUrl?: string;
    afterPhotoUrl: string;
  }): void {
    const user = this.getCurrentUser();
    const report = this.state.reports.find((r) => r.id === data.reportId);
    if (!report) throw new Error('Report not found');

    const now = new Date().toISOString();
    report.status = 'awaiting_verification';
    report.workPerformedNotes = data.workPerformed;
    report.materialsUsed = data.materialsUsed;
    report.updatedAt = now;

    if (data.beforePhotoUrl) {
      report.evidence.push({
        id: `ev_b_${Date.now()}`,
        url: data.beforePhotoUrl,
        type: 'resolution_before',
        caption: 'Before work began (Field Staff)',
        uploadedBy: user.name,
        uploadedAt: now
      });
    }

    report.evidence.push({
      id: `ev_a_${Date.now()}`,
      url: data.afterPhotoUrl,
      type: 'resolution_after',
      caption: 'Completed work resolution evidence',
      uploadedBy: user.name,
      uploadedAt: now
    });

    report.timeline.push({
      id: `tl_${Date.now()}`,
      status: 'awaiting_verification',
      title: 'Resolution Submitted for Verification',
      note: `Field work complete: ${data.workPerformed}`,
      actorName: user.name,
      actorRole: user.role,
      timestamp: now
    });

    // Notify Org Admin
    this.createNotification({
      recipientUserId: 'usr_admin_1',
      recipientRole: 'org_admin',
      type: 'verification',
      title: `Verification Requested: ${report.reportNumber}`,
      message: `${user.name} submitted completion evidence for ${report.title}.`,
      relatedEntityId: report.id,
      relatedEntityType: 'report'
    });

    this.recordAudit({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      organizationId: report.organizationId,
      action: 'SUBMIT_RESOLUTION',
      targetType: 'report',
      targetId: report.id,
      details: `Submitted resolution with after-photo evidence`
    });

    this.notify();
  }

  public verifyResolution(reportId: string, approved: boolean, notes: string): void {
    const user = this.getCurrentUser();
    const report = this.state.reports.find((r) => r.id === reportId);
    if (!report) throw new Error('Report not found');

    const now = new Date().toISOString();
    report.resolutionVerification = {
      verifiedBy: user.name,
      verifiedAt: now,
      decision: approved ? 'approved' : 'rejected',
      notes
    };
    report.updatedAt = now;

    if (approved) {
      report.status = 'resolved';
      report.resolvedAt = now;
      report.timeline.push({
        id: `tl_${Date.now()}`,
        status: 'resolved',
        title: 'Resolution Verified & Certified',
        note: `Approved by ${user.name}: ${notes}`,
        actorName: user.name,
        actorRole: user.role,
        timestamp: now
      });

      // Notify citizen to confirm
      this.createNotification({
        recipientUserId: report.submittedBy.id,
        recipientRole: 'citizen',
        type: 'report_status',
        title: `Issue Resolved: ${report.reportNumber}`,
        message: `Field work verified and marked resolved. Please inspect and confirm or provide feedback.`,
        relatedEntityId: report.id,
        relatedEntityType: 'report'
      });
    } else {
      report.status = 'in_progress';
      report.timeline.push({
        id: `tl_${Date.now()}`,
        status: 'in_progress',
        title: 'Resolution Rejected — Rework Required',
        note: `Supervisor ${user.name} requested adjustments: ${notes}`,
        actorName: user.name,
        actorRole: user.role,
        timestamp: now
      });

      if (report.assignedStaff) {
        this.createNotification({
          recipientUserId: report.assignedStaff.id,
          recipientRole: 'field_staff',
          type: 'report_status',
          title: `Rework Required on ${report.reportNumber}`,
          message: notes,
          relatedEntityId: report.id,
          relatedEntityType: 'report'
        });
      }
    }

    this.recordAudit({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      organizationId: report.organizationId,
      action: approved ? 'VERIFY_RESOLUTION_APPROVED' : 'VERIFY_RESOLUTION_REJECTED',
      targetType: 'report',
      targetId: report.id,
      details: notes
    });

    this.notify();
  }

  public citizenConfirmOrReopen(reportId: string, confirmed: boolean, comment?: string, rating?: number): void {
    const user = this.getCurrentUser();
    const report = this.state.reports.find((r) => r.id === reportId);
    if (!report) throw new Error('Report not found');

    const now = new Date().toISOString();
    report.updatedAt = now;

    if (confirmed) {
      report.status = 'closed';
      report.closedAt = now;
      report.citizenFeedback = {
        confirmedResolved: true,
        satisfactionRating: rating || 5,
        comment: comment || 'Confirmed resolved by citizen.',
        confirmedAt: now
      };
      report.timeline.push({
        id: `tl_${Date.now()}`,
        status: 'closed',
        title: 'Citizen Confirmed Resolution & Closed',
        note: comment ? `Rating: ${rating}/5. ${comment}` : `Rating: ${rating}/5.`,
        actorName: user.name,
        actorRole: user.role,
        timestamp: now
      });
    } else {
      report.status = 'reopened';
      report.citizenFeedback = {
        confirmedResolved: false,
        comment: comment || 'Citizen disputed resolution.',
        confirmedAt: now
      };
      report.timeline.push({
        id: `tl_${Date.now()}`,
        status: 'reopened',
        title: 'Report Reopened by Citizen',
        note: `Dispute reason: ${comment}`,
        actorName: user.name,
        actorRole: user.role,
        timestamp: now
      });

      this.createNotification({
        recipientUserId: 'usr_admin_1',
        recipientRole: 'org_admin',
        type: 'report_status',
        title: `Report Reopened: ${report.reportNumber}`,
        message: `${user.name} reported that the problem was not satisfactorily resolved: "${comment}"`,
        relatedEntityId: report.id,
        relatedEntityType: 'report'
      });
    }

    this.notify();
  }

  // --- PUBLIC ALERTS LIFECYCLE ---

  public createAlert(data: {
    title: string;
    description: string;
    category: string;
    severity: AlertSeverity;
    affectedArea: string;
    instructions: string[];
    expiresAt?: string;
    status: 'draft' | 'published';
  }): PublicAlert {
    const user = this.getCurrentUser();
    const alertNum = `ALT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    const newAlert: PublicAlert = {
      id: `alt_${Date.now()}`,
      alertNumber: alertNum,
      title: data.title,
      description: data.description,
      category: data.category,
      severity: data.severity,
      issuingOrgId: user.organizationId || 'org_metro_pw',
      issuingOrgName: user.organizationName || 'Metro Department of Public Works',
      publicationStatus: data.status,
      affectedArea: data.affectedArea,
      instructions: data.instructions,
      publishedAt: now,
      expiresAt: data.expiresAt,
      createdBy: user.name,
      savedByUsers: []
    };

    this.state.alerts.unshift(newAlert);

    if (data.status === 'published') {
      // Dispatch public notification
      this.createNotification({
        recipientUserId: 'all',
        recipientRole: 'all',
        type: 'alert',
        title: `Official Alert: ${data.title}`,
        message: `Issued by ${newAlert.issuingOrgName} for ${data.affectedArea}`,
        relatedEntityId: newAlert.id,
        relatedEntityType: 'alert'
      });
    }

    this.recordAudit({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      organizationId: newAlert.issuingOrgId,
      action: data.status === 'published' ? 'PUBLISH_ALERT' : 'DRAFT_ALERT',
      targetType: 'alert',
      targetId: newAlert.id,
      details: `${data.status.toUpperCase()} public alert ${alertNum}: ${data.title}`,
      severity: data.severity === 'emergency' ? 'critical' : data.severity === 'warning' ? 'warning' : 'info'
    });

    this.notify();
    return newAlert;
  }

  public updateAlertStatus(alertId: string, status: 'published' | 'withdrawn' | 'expired'): void {
    const user = this.getCurrentUser();
    const alert = this.state.alerts.find((a) => a.id === alertId);
    if (!alert) throw new Error('Alert not found');

    alert.publicationStatus = status;
    alert.updatedAt = new Date().toISOString();

    this.recordAudit({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      organizationId: alert.issuingOrgId,
      action: `ALERT_STATUS_${status.toUpperCase()}`,
      targetType: 'alert',
      targetId: alert.id,
      details: `Alert ${alert.alertNumber} status changed to ${status}`
    });

    this.notify();
  }

  public toggleSaveAlert(alertId: string): boolean {
    const user = this.getCurrentUser();
    const alert = this.state.alerts.find((a) => a.id === alertId);
    if (!alert) return false;

    if (!alert.savedByUsers) alert.savedByUsers = [];
    const index = alert.savedByUsers.indexOf(user.id);
    let saved = false;
    if (index >= 0) {
      alert.savedByUsers.splice(index, 1);
      saved = false;
    } else {
      alert.savedByUsers.push(user.id);
      saved = true;
    }
    this.notify();
    return saved;
  }

  // --- NOTIFICATIONS ---

  public createNotification(data: {
    recipientUserId: string;
    recipientRole: UserRole | 'all';
    type: 'report_status' | 'alert' | 'assignment' | 'verification' | 'system';
    title: string;
    message: string;
    relatedEntityId?: string;
    relatedEntityType?: 'report' | 'alert' | 'organization';
  }): InAppNotification {
    const notif: InAppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      recipientUserId: data.recipientUserId,
      recipientRole: data.recipientRole,
      type: data.type,
      title: data.title,
      message: data.message,
      relatedEntityId: data.relatedEntityId,
      relatedEntityType: data.relatedEntityType,
      read: false,
      createdAt: new Date().toISOString()
    };
    this.state.notifications.unshift(notif);
    return notif;
  }

  public markNotificationRead(notifId: string): void {
    const notif = this.state.notifications.find((n) => n.id === notifId);
    if (notif) {
      notif.read = true;
      this.notify();
    }
  }

  public markAllNotificationsRead(userId: string): void {
    this.state.notifications.forEach((n) => {
      if (n.recipientUserId === userId || n.recipientUserId === 'all') {
        n.read = true;
      }
    });
    this.notify();
  }

  // --- AUDIT LOGS ---

  public recordAudit(data: {
    actorId: string;
    actorName: string;
    actorRole: UserRole | 'system';
    organizationId?: string;
    organizationName?: string;
    action: string;
    targetType: 'report' | 'alert' | 'organization' | 'user' | 'config';
    targetId: string;
    details: string;
    severity?: 'info' | 'warning' | 'critical';
  }): void {
    const audit: AuditLog = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      actorId: data.actorId,
      actorName: data.actorName,
      actorRole: data.actorRole,
      organizationId: data.organizationId,
      organizationName: data.organizationName,
      action: data.action,
      targetType: data.targetType,
      targetId: data.targetId,
      details: data.details,
      severity: data.severity || 'info',
      timestamp: new Date().toISOString()
    };
    this.state.auditLogs.unshift(audit);
  }

  // --- SUPER ADMIN ACTIONS ---

  public updateOrganizationStatus(orgId: string, status: 'active' | 'suspended' | 'pending'): void {
    const user = this.getCurrentUser();
    const org = this.state.organizations.find((o) => o.id === orgId);
    if (!org) throw new Error('Organization not found');

    org.status = status;
    this.recordAudit({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      organizationId: org.id,
      organizationName: org.name,
      action: `ORGANIZATION_STATUS_${status.toUpperCase()}`,
      targetType: 'organization',
      targetId: org.id,
      details: `Super Admin set ${org.name} status to ${status}`,
      severity: status === 'suspended' ? 'critical' : 'info'
    });
    this.notify();
  }

  public updateUserRole(userId: string, newRole: UserRole): void {
    const user = this.getCurrentUser();
    const target = this.state.users.find((u) => u.id === userId);
    if (!target) throw new Error('User not found');

    const prevRole = target.role;
    target.role = newRole;
    this.recordAudit({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'UPDATE_USER_ROLE',
      targetType: 'user',
      targetId: target.id,
      details: `Changed role of ${target.name} from ${prevRole} to ${newRole}`
    });
    this.notify();
  }

  // --- EXPORT CSV ---

  
  public updateProfile(userId: string, data: { name?: string; phone?: string }): UserProfile {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    if (data.name) user.name = data.name.trim();
    if (data.phone !== undefined) user.phone = data.phone.trim();
    this.recordAudit({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'UPDATE_PROFILE',
      targetType: 'user',
      targetId: user.id,
      details: 'Updated profile details'
    });
    this.notify();
    return user;
  }

  public updateAlert(alertId: string, data: Partial<PublicAlert>): PublicAlert {
    const user = this.getCurrentUser();
    const alert = this.state.alerts.find(a => a.id === alertId);
    if (!alert) throw new Error('Alert not found');
    if (data.title) alert.title = data.title;
    if (data.description) alert.description = data.description;
    if (data.category) alert.category = data.category;
    if (data.severity) alert.severity = data.severity;
    if (data.affectedArea) alert.affectedArea = data.affectedArea;
    if (data.instructions) alert.instructions = data.instructions;
    if (data.expiresAt !== undefined) alert.expiresAt = data.expiresAt;
    if (data.publicationStatus) alert.publicationStatus = data.publicationStatus;
    alert.updatedAt = new Date().toISOString();

    this.recordAudit({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      organizationId: alert.issuingOrgId,
      action: 'UPDATE_ALERT',
      targetType: 'alert',
      targetId: alert.id,
      details: `Updated alert ${alert.alertNumber} (${alert.title})`
    });
    this.notify();
    return alert;
  }

  public updateDepartment(deptId: string, data: Partial<Department>): Department {
    const user = this.getCurrentUser();
    const dept = this.state.departments.find(d => d.id === deptId);
    if (!dept) throw new Error('Department not found');
    if (data.name) dept.name = data.name;
    if (data.description) dept.description = data.description;
    if (data.contactLead) dept.contactLead = data.contactLead;
    if (data.activeStatus !== undefined) dept.activeStatus = data.activeStatus;
    if (data.staffCount !== undefined) dept.staffCount = data.staffCount;

    this.recordAudit({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'UPDATE_DEPARTMENT',
      targetType: 'config',
      targetId: dept.id,
      details: `Updated department ${dept.name}`
    });
    this.notify();
    return dept;
  }

  public updateCategory(catId: string, data: Partial<IssueCategory>): IssueCategory {
    const user = this.getCurrentUser();
    const cat = this.state.categories.find(c => c.id === catId);
    if (!cat) throw new Error('Category not found');
    if (data.name) cat.name = data.name;
    if (data.description) cat.description = data.description;
    if (data.defaultDepartmentName) cat.defaultDepartmentName = data.defaultDepartmentName;
    if (data.slaHours !== undefined) cat.slaHours = data.slaHours;
    if (data.activeStatus !== undefined) cat.activeStatus = data.activeStatus;

    this.recordAudit({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'UPDATE_CATEGORY',
      targetType: 'config',
      targetId: cat.id,
      details: `Updated category ${cat.name} (SLA: ${cat.slaHours}h)`
    });
    this.notify();
    return cat;
  }

  public updateUserStatus(userId: string, status: 'active' | 'suspended' | 'pending'): void {
    const user = this.getCurrentUser();
    const target = this.state.users.find(u => u.id === userId);
    if (!target) throw new Error('User not found');
    target.accountStatus = status;
    this.recordAudit({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'UPDATE_USER_STATUS',
      targetType: 'user',
      targetId: target.id,
      details: `Updated account status for ${target.name} to ${status}`
    });
    this.notify();
  }

  public exportReportsToCSV(): string {
    const headers = ['Report ID', 'Title', 'Category', 'Status', 'Priority', 'District', 'Submitted By', 'Assigned To', 'Created Date'];
    const rows = this.state.reports.map((r) => [
      `"${r.reportNumber}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.categoryName}"`,
      `"${r.status}"`,
      `"${r.priority}"`,
      `"${r.location.district}"`,
      `"${r.submittedBy.name}"`,
      `"${r.assignedStaff?.name || 'Unassigned'}"`,
      `"${new Date(r.createdAt).toISOString()}"`
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

export const civicStore = new CivicSyncStore();
