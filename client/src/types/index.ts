// ── Shared Types ───────────────────────────────────────────────────

export interface MassTiming {
  _id: string;
  day: string;
  time: string;
  description: string;
  category: 'Weekday' | 'Sunday';
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  date: string;
  expiry: string;
  pdf_url: string;
}

export interface ParishCouncilMember {
  _id: string;
  name: string;
  role: string;
  image_url: string;
  phone: string;
  dob: string;
  feast_day: string;
  normal_mass_time: string;
  special_mass_time: string;
}

export interface Trustee {
  _id: string;
  name: string;
  role: string;
  image_url: string;
  phone: string;
  dob: string;
  feast_day: string;
  installation_date: string;
}

export interface LeadershipMember {
  name: string;
  phone: string;
  address: string;
  image_url: string;
}

export interface Family {
  name: string;
  phone: string;
  address: string;
  email: string;
  image_url: string;
  visible: boolean;
}

export interface FamilyUnit {
  _id: string;
  unit_number: number;
  name: string;
  show_photo: boolean;
  president: LeadershipMember;
  secretary: LeadershipMember;
  treasurer: LeadershipMember;
  families: Family[];
}

export interface SiteSettings {
  maintenance_mode: boolean;
  maintenance_message: string;
}

export interface PrayerRequest {
  _id: string;
  name: string;
  email: string;
  intention: string;
  createdAt: string;
}

export interface AdminStats {
  masses: number;
  announcements: number;
  council: number;
  prayers: number;
}
