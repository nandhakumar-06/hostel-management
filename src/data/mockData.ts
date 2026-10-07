import type { Student, Hostel, Room, FeeRecord, Complaint, VisitorRecord, Notice } from '../types';

export const INITIAL_HOSTELS: Hostel[] = [
  {
    id: 'h-1',
    name: 'North Star Residence',
    code: 'NSR-BLOCK-A',
    type: 'Boys',
    totalRooms: 40,
    totalCapacity: 80,
    occupiedBeds: 54,
    wardenName: 'Dr. Rajesh Verma',
    wardenPhone: '+91 98765 43210',
    amenities: ['Wi-Fi 6', '24/7 Power Backup', 'Study Lounge', 'Gym', 'Laundry Service']
  },
  {
    id: 'h-2',
    name: 'Lotus Heights',
    code: 'LTH-BLOCK-B',
    type: 'Girls',
    totalRooms: 35,
    totalCapacity: 70,
    occupiedBeds: 48,
    wardenName: 'Mrs. Sunita Sharma',
    wardenPhone: '+91 98765 12345',
    amenities: ['Wi-Fi 6', 'Security Guards', 'Badminton Court', 'Common Kitchen', 'Library']
  },
  {
    id: 'h-3',
    name: 'Emerald International Hostel',
    code: 'EMR-BLOCK-C',
    type: 'Co-ed',
    totalRooms: 25,
    totalCapacity: 50,
    occupiedBeds: 32,
    wardenName: 'Prof. Anil Kulkarni',
    wardenPhone: '+91 98123 45678',
    amenities: ['AC Rooms', 'Cafeteria', 'Gaming Zone', '24/7 Medical Care']
  }
];

export const INITIAL_ROOMS: Room[] = [
  { id: 'r-101', hostelId: 'h-1', hostelName: 'North Star Residence', roomNumber: '101', floor: 1, type: 'Double', capacity: 2, currentOccupancy: 2, rentPerMonth: 4500, status: 'Full' },
  { id: 'r-102', hostelId: 'h-1', hostelName: 'North Star Residence', roomNumber: '102', floor: 1, type: 'Double', capacity: 2, currentOccupancy: 1, rentPerMonth: 4500, status: 'Available' },
  { id: 'r-103', hostelId: 'h-1', hostelName: 'North Star Residence', roomNumber: '103', floor: 1, type: 'Single', capacity: 1, currentOccupancy: 0, rentPerMonth: 7000, status: 'Available' },
  { id: 'r-104', hostelId: 'h-1', hostelName: 'North Star Residence', roomNumber: '104', floor: 1, type: 'Triple', capacity: 3, currentOccupancy: 3, rentPerMonth: 3500, status: 'Full' },
  { id: 'r-201', hostelId: 'h-2', hostelName: 'Lotus Heights', roomNumber: '201', floor: 2, type: 'Double', capacity: 2, currentOccupancy: 1, rentPerMonth: 4800, status: 'Available' },
  { id: 'r-202', hostelId: 'h-2', hostelName: 'Lotus Heights', roomNumber: '202', floor: 2, type: 'Single', capacity: 1, currentOccupancy: 1, rentPerMonth: 7500, status: 'Full' },
  { id: 'r-203', hostelId: 'h-2', hostelName: 'Lotus Heights', roomNumber: '203', floor: 2, type: 'Double', capacity: 2, currentOccupancy: 0, rentPerMonth: 4800, status: 'Maintenance' },
  { id: 'r-301', hostelId: 'h-3', hostelName: 'Emerald International Hostel', roomNumber: '301', floor: 3, type: 'Double', capacity: 2, currentOccupancy: 2, rentPerMonth: 8500, status: 'Full' },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's-1',
    studentId: 'STU-2024-001',
    name: 'Aarav Patel',
    email: 'aarav.patel@student.edu',
    phone: '+91 91234 56789',
    department: 'Computer Science',
    year: '3rd Year',
    hostelId: 'h-1',
    hostelName: 'North Star Residence',
    roomNumber: '101',
    status: 'Active',
    emergencyContact: '+91 98989 11223',
    guardianName: 'Ramesh Patel',
    joinedDate: '2024-08-15'
  },
  {
    id: 's-2',
    studentId: 'STU-2024-002',
    name: 'Priya Sharma',
    email: 'priya.sharma@student.edu',
    phone: '+91 92345 67890',
    department: 'Information Technology',
    year: '2nd Year',
    hostelId: 'h-2',
    hostelName: 'Lotus Heights',
    roomNumber: '201',
    status: 'Active',
    emergencyContact: '+91 97878 33445',
    guardianName: 'Suresh Sharma',
    joinedDate: '2024-08-16'
  },
  {
    id: 's-3',
    studentId: 'STU-2024-003',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@student.edu',
    phone: '+91 93456 78901',
    department: 'Mechanical Engineering',
    year: '4th Year',
    hostelId: 'h-1',
    hostelName: 'North Star Residence',
    roomNumber: '101',
    status: 'Active',
    emergencyContact: '+91 96767 55667',
    guardianName: 'Vijay Gupta',
    joinedDate: '2023-08-10'
  },
  {
    id: 's-4',
    studentId: 'STU-2024-004',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@student.edu',
    phone: '+91 94567 89012',
    department: 'Electronics & Comm.',
    year: '1st Year',
    hostelId: 'h-2',
    hostelName: 'Lotus Heights',
    roomNumber: '202',
    status: 'Active',
    emergencyContact: '+91 95656 77889',
    guardianName: 'Narayanan Iyer',
    joinedDate: '2025-08-01'
  },
  {
    id: 's-5',
    studentId: 'STU-2024-005',
    name: 'Vikram Singh',
    email: 'vikram.singh@student.edu',
    phone: '+91 95678 90123',
    department: 'Civil Engineering',
    year: '3rd Year',
    hostelId: 'h-1',
    hostelName: 'North Star Residence',
    roomNumber: '102',
    status: 'Active',
    emergencyContact: '+91 94545 99001',
    guardianName: 'Mahendra Singh',
    joinedDate: '2024-08-20'
  }
];

export const INITIAL_FEES: FeeRecord[] = [
  { id: 'f-1', studentId: 'STU-2024-001', studentName: 'Aarav Patel', roomNumber: '101', feeType: 'Full Package', totalAmount: 45000, paidAmount: 45000, pendingAmount: 0, dueDate: '2026-10-15', status: 'Paid', lastPaymentDate: '2026-10-01' },
  { id: 'f-2', studentId: 'STU-2024-002', studentName: 'Priya Sharma', roomNumber: '201', feeType: 'Rent', totalAmount: 28000, paidAmount: 14000, pendingAmount: 14000, dueDate: '2026-10-20', status: 'Partial', lastPaymentDate: '2026-09-15' },
  { id: 'f-3', studentId: 'STU-2024-003', studentName: 'Rohan Gupta', roomNumber: '101', feeType: 'Mess', totalAmount: 18000, paidAmount: 0, pendingAmount: 18000, dueDate: '2026-10-10', status: 'Pending' },
  { id: 'f-4', studentId: 'STU-2024-004', studentName: 'Ananya Iyer', roomNumber: '202', feeType: 'Full Package', totalAmount: 50000, paidAmount: 50000, pendingAmount: 0, dueDate: '2026-10-05', status: 'Paid', lastPaymentDate: '2026-09-30' },
  { id: 'f-5', studentId: 'STU-2024-005', studentName: 'Vikram Singh', roomNumber: '102', feeType: 'Security', totalAmount: 10000, paidAmount: 0, pendingAmount: 10000, dueDate: '2026-10-30', status: 'Pending' }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'c-101',
    studentId: 'STU-2024-001',
    studentName: 'Aarav Patel',
    roomNumber: '101',
    hostelName: 'North Star Residence',
    category: 'Wi-Fi',
    title: 'Low Wi-Fi signal in 1st Floor wing',
    description: 'The Wi-Fi router on the 1st floor keeps disconnecting every 15 minutes during evening hours.',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2026-10-05 14:30',
    adminNote: 'Network team dispatched to inspect router channel interference.'
  },
  {
    id: 'c-102',
    studentId: 'STU-2024-002',
    studentName: 'Priya Sharma',
    roomNumber: '201',
    hostelName: 'Lotus Heights',
    category: 'Plumbing',
    title: 'Bathroom tap leak in Room 201',
    description: 'Continuous water drip from the sink faucet causing water wastage.',
    priority: 'High',
    status: 'Pending',
    createdAt: '2026-10-06 09:15'
  },
  {
    id: 'c-103',
    studentId: 'STU-2024-003',
    studentName: 'Rohan Gupta',
    roomNumber: '101',
    hostelName: 'North Star Residence',
    category: 'Electrical',
    title: 'Study table socket not working',
    description: 'Power point near study table has no electrical current.',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2026-10-02 11:00',
    updatedAt: '2026-10-03 16:20',
    adminNote: 'Replaced socket unit and verified with multimeter.'
  }
];

export const INITIAL_VISITORS: VisitorRecord[] = [
  {
    id: 'v-1',
    visitorName: 'Ramesh Patel',
    phone: '+91 98989 11223',
    relation: 'Father',
    studentId: 'STU-2024-001',
    studentName: 'Aarav Patel',
    purpose: 'Delivering books and autumn clothing',
    entryTime: '2026-10-07 10:15',
    status: 'In Campus'
  },
  {
    id: 'v-2',
    visitorName: 'Sunil Sharma',
    phone: '+91 98888 44332',
    relation: 'Brother',
    studentId: 'STU-2024-002',
    studentName: 'Priya Sharma',
    purpose: 'Family visit',
    entryTime: '2026-10-07 11:30',
    exitTime: '2026-10-07 13:45',
    status: 'Checked Out'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'n-1',
    title: 'Quarterly Pest Control Drive',
    content: 'Pest control spraying is scheduled for North Star Residence and Lotus Heights on Saturday from 10:00 AM to 1:00 PM. Please ensure your personal items are secured.',
    date: '2026-10-06',
    target: 'All',
    priority: 'Important'
  },
  {
    id: 'n-2',
    title: 'Hostel Night & Cultural Festival Registration',
    content: 'Registrations are open for the annual Hostel Cultural Night. Interested students can sign up with their respective hostel warden by Oct 12.',
    date: '2026-10-04',
    target: 'All',
    priority: 'Normal'
  }
];
