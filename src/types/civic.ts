export type UserRole = 'citizen' | 'org_admin' | 'field_staff' | 'super_admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
  departmentId?: string;
  departmentName?: string;
  phone?: string;
  avatarUrl?: string;
  accountStatus: 'active' | 'suspended' | 'pending';
  demoEmail?: string;
  demoPassword?: string;
  joinedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'Municipal Department' | 'Public Works' | 'Emergency Services' | 'Transportation' | 'Water Authority';
  serviceArea: string;
  description: string;
  status: 'active' | 'pending' | 'suspended';
  contactEmail: string;
  phone: string;
  verifiedAt: string;
  adminCount: number;
  staffCount: number;
  activeReportsCount: number;
}

export interface Department {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  activeStatus: boolean;
  staffCount: number;
  contactLead: string;
}

export interface IssueCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  defaultDepartmentName: string;
  activeStatus: boolean;
  slaHours: number;
}

export type ReportStatus =
  | 'submitted'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'awaiting_verification'
  | 'resolved'
  | 'closed'
  | 'more_info_required'
  | 'rejected'
  | 'on_hold'
  | 'reopened';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface ReportEvidence {
  id: string;
  url: string;
  type: 'initial' | 'progress' | 'resolution_before' | 'resolution_after';
  caption: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ReportTimelineEvent {
  id: string;
  status: ReportStatus;
  title: string;
  note?: string;
  actorName: string;
  actorRole: UserRole | 'system';
  isInternal?: boolean;
  timestamp: string;
}

export interface CivicReport {
  id: string;
  reportNumber: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  status: ReportStatus;
  priority: PriorityLevel;
  location: {
    address: string;
    landmark?: string;
    lat: number;
    lng: number;
    district: string;
  };
  submittedBy: {
    id: string;
    name: string;
    email: string;
  };
  organizationId?: string;
  organizationName?: string;
  departmentId?: string;
  departmentName?: string;
  assignedStaff?: {
    id: string;
    name: string;
    role: string;
    assignedAt: string;
    departmentName: string;
  };
  assignmentInstructions?: string;
  targetCompletionDate?: string;
  evidence: ReportEvidence[];
  workPerformedNotes?: string;
  materialsUsed?: string;
  resolutionVerification?: {
    verifiedBy: string;
    verifiedAt: string;
    decision: 'approved' | 'rejected';
    notes?: string;
  };
  citizenFeedback?: {
    confirmedResolved: boolean;
    satisfactionRating?: number;
    comment?: string;
    confirmedAt?: string;
  };
  rejectionReason?: string;
  moreInfoRequestedNotes?: string;
  citizenMoreInfoResponse?: string;
  timeline: ReportTimelineEvent[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

export type AlertSeverity = 'advisory' | 'watch' | 'warning' | 'emergency';
export type AlertPublicationStatus = 'draft' | 'scheduled' | 'published' | 'expired' | 'withdrawn';

export interface PublicAlert {
  id: string;
  alertNumber: string;
  title: string;
  description: string;
  category: string;
  severity: AlertSeverity;
  issuingOrgId: string;
  issuingOrgName: string;
  publicationStatus: AlertPublicationStatus;
  affectedArea: string;
  coordinates?: {
    lat: number;
    lng: number;
    radiusKm?: number;
  };
  instructions: string[];
  publishedAt: string;
  expiresAt?: string;
  updatedAt?: string;
  createdBy: string;
  savedByUsers?: string[];
}

export interface InAppNotification {
  id: string;
  recipientUserId: string;
  recipientRole: UserRole | 'all';
  type: 'report_status' | 'alert' | 'assignment' | 'verification' | 'system';
  title: string;
  message: string;
  relatedEntityId?: string;
  relatedEntityType?: 'report' | 'alert' | 'organization';
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
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
  timestamp: string;
}
