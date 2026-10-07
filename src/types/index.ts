export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string; // linked student if role is student
}

export interface Student {
  id: string;
  studentId: string; // e.g. STU-2024-001
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  hostelId?: string;
  hostelName?: string;
  roomNumber?: string;
  status: 'Active' | 'Inactive';
  emergencyContact: string;
  guardianName: string;
  joinedDate: string;
}

export interface Hostel {
  id: string;
  name: string;
  code: string; // e.g. H-BLOCK-A
  type: 'Boys' | 'Girls' | 'Co-ed';
  totalRooms: number;
  totalCapacity: number;
  occupiedBeds: number;
  wardenName: string;
  wardenPhone: string;
  amenities: string[];
}

export interface Room {
  id: string;
  hostelId: string;
  hostelName: string;
  roomNumber: string;
  floor: number;
  type: 'Single' | 'Double' | 'Triple';
  capacity: number;
  currentOccupancy: number;
  rentPerMonth: number;
  status: 'Available' | 'Full' | 'Maintenance';
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  feeType: 'Rent' | 'Mess' | 'Security' | 'Full Package';
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Partial';
  lastPaymentDate?: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  hostelName: string;
  category: 'Plumbing' | 'Electrical' | 'Wi-Fi' | 'Cleanliness' | 'Furniture' | 'Other';
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Resolved';
  createdAt: string;
  updatedAt?: string;
  adminNote?: string;
}

export interface VisitorRecord {
  id: string;
  visitorName: string;
  phone: string;
  relation: string;
  studentId: string;
  studentName: string;
  purpose: string;
  entryTime: string;
  exitTime?: string;
  status: 'In Campus' | 'Checked Out';
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  target: 'All' | 'Boys' | 'Girls';
  priority: 'Normal' | 'Important';
}
