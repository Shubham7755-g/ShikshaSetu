import { Complaint, StatusHistoryItem } from '../types';

// Helper to generate past ISO dates
const getPastDateISO = (daysAgo: number, hoursAgo = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
};

export const INITIAL_DEMO_COMPLAINTS: Complaint[] = [
  {
    id: 'SS-1001',
    schoolName: 'Government Model School — Demo',
    location: 'Surajpur Block, Gautam Buddha Nagar',
    category: 'Drinking Water',
    description: 'Main outdoor drinking water tap fixture is cracked and leaking constantly. Children have to carry water from adjacent village well during midday meal.',
    reporterRole: 'Teacher',
    submittedAt: getPastDateISO(4, 3),
    assignedDepartment: 'Water Supply / Maintenance',
    status: 'In Progress',
    internalNotes: 'Work order #WM-402 issued to local pipeline technician. Replacement brass bib cock and joint sealant requested.',
    isDemo: true,
  },
  {
    id: 'SS-1002',
    schoolName: 'Government Model School — Demo',
    location: 'Surajpur Block, Gautam Buddha Nagar',
    category: 'Furniture',
    description: 'Four dual-desk benches in Grade 6 classroom have fractured wooden tops and exposed rusted screws, posing injury hazard to students.',
    reporterRole: 'Parent',
    submittedAt: getPastDateISO(1, 2),
    status: 'Submitted',
    isDemo: true,
  },
  {
    id: 'SS-1003',
    schoolName: 'Anganwadi Center 14 — Demo',
    location: 'Dankaur Block, Greater Noida',
    category: 'Toilets and Sanitation',
    description: 'Girls toilet flush tank broken and drainage pipe blocked. Facility completely non-functional for past two weeks. Requires urgent sanitation intervention.',
    reporterRole: 'School Management Committee Member',
    submittedAt: getPastDateISO(16, 5),
    assignedDepartment: 'Sanitation / School Maintenance',
    status: 'Under Review',
    delayReason: 'Sanitation contractor tendered across the block was delayed due to regional inventory shortage.',
    internalNotes: 'Escalated to Block Education Officer on Day 10.',
    isDemo: true,
  },
  {
    id: 'SS-1004',
    schoolName: 'Government Model School — Demo',
    location: 'Surajpur Block, Gautam Buddha Nagar',
    category: 'Electricity',
    description: 'Main switchboard in primary wing sparking and circuit breaker trips whenever classroom fans are turned on. Wiring needs replacement.',
    reporterRole: 'School Administrator',
    submittedAt: getPastDateISO(3, 4),
    assignedDepartment: 'Electrical Maintenance',
    status: 'Assigned',
    internalNotes: 'Junior engineer scheduled for site audit on Thursday morning.',
    isDemo: true,
  },
  {
    id: 'SS-1005',
    schoolName: 'Government Girls High School — Demo',
    location: 'Kasna Block, Greater Noida',
    category: 'Roof or Building Damage',
    description: 'Heavy seepage and plaster peeling from ceiling in Science Lab during recent rainfall. Risk of falling masonry fragments.',
    reporterRole: 'Teacher',
    submittedAt: getPastDateISO(8, 6),
    assignedDepartment: 'Building Maintenance',
    status: 'Verification Pending',
    repairNotes: 'Polymer waterproofing layer applied over cracked roof slab, masonry re-plastered, and weather-seal coat cured.',
    repairReportedAt: getPastDateISO(0, 4),
    internalNotes: 'Technician completed physical works today. Verification pending from School Management Committee.',
    isDemo: true,
  },
];

export const INITIAL_DEMO_HISTORY: StatusHistoryItem[] = [
  // SS-1001 history
  {
    id: 'hist-1001-1',
    complaintId: 'SS-1001',
    previousStatus: 'Submitted',
    newStatus: 'Submitted',
    note: 'Complaint registered by Teacher (Rajesh Sharma) via ShikshaSetu portal.',
    author: 'Rajesh Sharma (Teacher)',
    timestamp: getPastDateISO(4, 3),
  },
  {
    id: 'hist-1001-2',
    complaintId: 'SS-1001',
    previousStatus: 'Submitted',
    newStatus: 'Under Review',
    note: 'Initial review completed by District Education Office desk.',
    author: 'District Officer',
    timestamp: getPastDateISO(3, 8),
  },
  {
    id: 'hist-1001-3',
    complaintId: 'SS-1001',
    previousStatus: 'Under Review',
    newStatus: 'Assigned',
    note: 'Assigned to Water Supply / Maintenance wing. Work order issued.',
    author: 'Admin Desk',
    timestamp: getPastDateISO(2, 6),
  },
  {
    id: 'hist-1001-4',
    complaintId: 'SS-1001',
    previousStatus: 'Assigned',
    newStatus: 'In Progress',
    note: 'Field plumbing contractor reached school premises for pipeline inspection.',
    author: 'Field Maintenance Desk',
    timestamp: getPastDateISO(1, 1),
  },

  // SS-1002 history
  {
    id: 'hist-1002-1',
    complaintId: 'SS-1002',
    previousStatus: 'Submitted',
    newStatus: 'Submitted',
    note: 'Complaint registered by Parent (Sunita Verma) via School QR Code.',
    author: 'Sunita Verma (Parent)',
    timestamp: getPastDateISO(1, 2),
  },

  // SS-1003 history
  {
    id: 'hist-1003-1',
    complaintId: 'SS-1003',
    previousStatus: 'Submitted',
    newStatus: 'Submitted',
    note: 'Urgent complaint registered by SMC Member regarding girls toilet.',
    author: 'SMC Member (Ramesh Kumar)',
    timestamp: getPastDateISO(16, 5),
  },
  {
    id: 'hist-1003-2',
    complaintId: 'SS-1003',
    previousStatus: 'Submitted',
    newStatus: 'Under Review',
    note: 'Forwarded to Block Sanitation unit.',
    author: 'District Desk',
    timestamp: getPastDateISO(14, 2),
  },

  // SS-1004 history
  {
    id: 'hist-1004-1',
    complaintId: 'SS-1004',
    previousStatus: 'Submitted',
    newStatus: 'Submitted',
    note: 'Electrical hazard reported by Headmaster.',
    author: 'School Administrator',
    timestamp: getPastDateISO(3, 4),
  },
  {
    id: 'hist-1004-2',
    complaintId: 'SS-1004',
    previousStatus: 'Submitted',
    newStatus: 'Assigned',
    note: 'Assigned to Electrical Maintenance wing. Priority grade 1.',
    author: 'Authority Control Cell',
    timestamp: getPastDateISO(2, 2),
  },

  // SS-1005 history
  {
    id: 'hist-1005-1',
    complaintId: 'SS-1005',
    previousStatus: 'Submitted',
    newStatus: 'Submitted',
    note: 'Roof leakage reported in Science laboratory.',
    author: 'Science Teacher',
    timestamp: getPastDateISO(8, 6),
  },
  {
    id: 'hist-1005-2',
    complaintId: 'SS-1005',
    previousStatus: 'Submitted',
    newStatus: 'Assigned',
    note: 'Assigned to Building Maintenance division.',
    author: 'Infrastructure Cell',
    timestamp: getPastDateISO(7, 2),
  },
  {
    id: 'hist-1005-3',
    complaintId: 'SS-1005',
    previousStatus: 'Assigned',
    newStatus: 'In Progress',
    note: 'Contractor mobilized scaffolding and masonry materials.',
    author: 'Building Contractor',
    timestamp: getPastDateISO(4, 1),
  },
  {
    id: 'hist-1005-4',
    complaintId: 'SS-1005',
    previousStatus: 'In Progress',
    newStatus: 'Verification Pending',
    note: 'Contractor completed waterproofing seal and reported repair. Ready for SMC verification.',
    author: 'Contractor Site Lead',
    timestamp: getPastDateISO(0, 4),
  },
];
