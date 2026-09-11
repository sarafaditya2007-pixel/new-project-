export type UserRole = 'member' | 'secretary';

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  unit?: string;
  societyName: string;
  designation: string;
  avatarUrl?: string;
  phone: string;
}

export interface SocietyNotice {
  id: string;
  title: string;
  content: string;
  category: 'Maintenance' | 'Emergency' | 'Meeting' | 'Security';
  date: string;
  author: string;
  urgent: boolean;
}

export interface FacilityItem {
  id: string;
  name: string;
  status: 'Open' | 'Maintenance' | 'Booked';
  hours: string;
  bookingFee?: string;
}

export type IssueCategory =
  | 'Potholes'
  | 'Streetlights'
  | 'Water Supply'
  | 'Garbage & Waste'
  | 'Electrical'
  | 'Security'
  | 'Elevator'
  | 'Parks & Gardens'
  | 'Drainage'
  | 'Other';

export type IssueStatus = 'Pending' | 'In Progress' | 'Resolved';
export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface TimelineEvent {
  status: IssueStatus | 'Submitted' | 'Assigned' | 'Inspection';
  label: string;
  date: string;
  note?: string;
}

export interface CommentItem {
  id: string;
  author: string;
  text: string;
  date: string;
  isStaff?: boolean;
}

export interface Issue {
  id: string;
  title: string;
  category: IssueCategory;
  societyName: string;
  address: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  date: string;
  timestamp: number;
  photoUrl?: string;
  reporterName: string;
  reporterUnit?: string;
  assignedDepartment?: string;
  upvotes: number;
  timeline: TimelineEvent[];
  comments: CommentItem[];
  mapCoords?: {
    x: number; // percentage on custom map
    y: number;
  };
}

export type ActiveTab = 'home' | 'report' | 'track' | 'map' | 'profile' | 'presentation';
