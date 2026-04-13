export type Role = 'admin' | 'coordinator';
export type TripStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'waived';

export interface College {
  id: number;
  name: string;
  address: string;
  contact_email: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  enrollment_no: string;
  department: string;
  year: number;
  college_id: number;
  college?: College;
  created_at: string;
  _count?: { registrations: number };
}

export interface Trip {
  id: number;
  title: string;
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  max_capacity: number;
  organizer_id: number;
  organizer?: { id: number; name: string };
  status: TripStatus;
  image_url?: string | null;
  created_at: string;
  registered_count?: number;
  seats_left?: number;
  _count?: { registrations: number };
}

export interface TripRegistration {
  id: number;
  trip_id: number;
  student_id: number;
  trip?: Pick<Trip, 'id' | 'title' | 'destination' | 'start_date'>;
  student?: Pick<Student, 'id' | 'name' | 'email' | 'phone' | 'department' | 'year' | 'enrollment_no'>;
  registered_at: string;
  payment_status: PaymentStatus;
  emergency_contact: string;
  medical_notes?: string | null;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}
