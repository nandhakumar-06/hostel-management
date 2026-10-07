-- ============================================================
-- HOSTEL MANAGEMENT SYSTEM (DBMS SQL QUERIES & SCHEMA)
-- Database File: hostel.db
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABLE CREATION (DDL)
-- ------------------------------------------------------------

-- Table: hostels
CREATE TABLE IF NOT EXISTS hostels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    type TEXT CHECK (type IN ('Boys', 'Girls', 'Co-ed')),
    total_rooms INTEGER DEFAULT 0,
    total_capacity INTEGER DEFAULT 0,
    occupied_beds INTEGER DEFAULT 0,
    warden_name TEXT NOT NULL,
    warden_phone TEXT NOT NULL,
    amenities TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: rooms
CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    hostel_id TEXT REFERENCES hostels(id) ON DELETE CASCADE,
    hostel_name TEXT NOT NULL,
    room_number TEXT NOT NULL,
    floor INTEGER DEFAULT 1,
    type TEXT CHECK (type IN ('Single', 'Double', 'Triple')),
    capacity INTEGER DEFAULT 2,
    current_occupancy INTEGER DEFAULT 0,
    rent_per_month REAL DEFAULT 0,
    status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Full', 'Maintenance')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(hostel_id, room_number)
);

-- Table: students
CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    student_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    hostel_id TEXT REFERENCES hostels(id) ON DELETE SET NULL,
    hostel_name TEXT,
    room_number TEXT,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    guardian_name TEXT,
    emergency_contact TEXT,
    joined_date TEXT DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: fee_records
CREATE TABLE IF NOT EXISTS fee_records (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    room_number TEXT,
    fee_type TEXT CHECK (fee_type IN ('Rent', 'Mess', 'Security', 'Full Package')),
    total_amount REAL NOT NULL,
    paid_amount REAL DEFAULT 0,
    pending_amount REAL NOT NULL,
    due_date TEXT NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Paid', 'Pending', 'Partial')),
    last_payment_date TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: complaints
CREATE TABLE IF NOT EXISTS complaints (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    room_number TEXT,
    hostel_name TEXT,
    category TEXT CHECK (category IN ('Plumbing', 'Electrical', 'Wi-Fi', 'Cleanliness', 'Furniture', 'Other')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved')),
    admin_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: visitor_records
CREATE TABLE IF NOT EXISTS visitor_records (
    id TEXT PRIMARY KEY,
    visitor_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    relation TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    purpose TEXT NOT NULL,
    entry_time TEXT NOT NULL,
    exit_time TEXT,
    status TEXT DEFAULT 'In Campus' CHECK (status IN ('In Campus', 'Checked Out')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: notices
CREATE TABLE IF NOT EXISTS notices (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date TEXT DEFAULT CURRENT_DATE,
    target TEXT DEFAULT 'All',
    priority TEXT DEFAULT 'Normal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ------------------------------------------------------------
-- 2. SAMPLE DATA INSERTION (DML)
-- ------------------------------------------------------------

INSERT OR REPLACE INTO hostels (id, name, code, type, total_rooms, total_capacity, occupied_beds, warden_name, warden_phone, amenities) VALUES
('h-1', 'North Star Residence', 'NSR-BLOCK-A', 'Boys', 40, 80, 54, 'Dr. Rajesh Verma', '+91 98765 43210', 'Wi-Fi 6, 24/7 Power Backup, Study Lounge, Gym'),
('h-2', 'Lotus Heights', 'LTH-BLOCK-B', 'Girls', 35, 70, 48, 'Mrs. Sunita Sharma', '+91 98765 12345', 'Wi-Fi 6, Security Guards, Badminton Court, Library'),
('h-3', 'Emerald International Hostel', 'EMR-BLOCK-C', 'Co-ed', 25, 50, 32, 'Prof. Anil Kulkarni', '+91 98123 45678', 'AC Rooms, Cafeteria, Gaming Zone');

INSERT OR REPLACE INTO rooms (id, hostel_id, hostel_name, room_number, floor, type, capacity, current_occupancy, rent_per_month, status) VALUES
('r-101', 'h-1', 'North Star Residence', '101', 1, 'Double', 2, 2, 4500, 'Full'),
('r-102', 'h-1', 'North Star Residence', '102', 1, 'Double', 2, 1, 4500, 'Available'),
('r-103', 'h-1', 'North Star Residence', '103', 1, 'Single', 1, 0, 7000, 'Available'),
('r-201', 'h-2', 'Lotus Heights', '201', 2, 'Double', 2, 1, 4800, 'Available'),
('r-202', 'h-2', 'Lotus Heights', '202', 2, 'Single', 1, 1, 7500, 'Full');

INSERT OR REPLACE INTO students (id, student_id, name, email, phone, department, year, hostel_id, hostel_name, room_number, status, guardian_name, emergency_contact, joined_date) VALUES
('s-1', 'STU-2024-001', 'Aarav Patel', 'aarav.patel@student.edu', '+91 91234 56789', 'Computer Science', '3rd Year', 'h-1', 'North Star Residence', '101', 'Active', 'Ramesh Patel', '+91 98989 11223', '2024-08-15'),
('s-2', 'STU-2024-002', 'Priya Sharma', 'priya.sharma@student.edu', '+91 92345 67890', 'Information Technology', '2nd Year', 'h-2', 'Lotus Heights', '201', 'Active', 'Suresh Sharma', '+91 97878 33445', '2024-08-16'),
('s-3', 'STU-2024-003', 'Rohan Gupta', 'rohan.gupta@student.edu', '+91 93456 78901', 'Mechanical Engineering', '4th Year', 'h-1', 'North Star Residence', '101', 'Active', 'Vijay Gupta', '+91 96767 55667', '2023-08-10');

INSERT OR REPLACE INTO fee_records (id, student_id, student_name, room_number, fee_type, total_amount, paid_amount, pending_amount, due_date, status) VALUES
('f-1', 'STU-2024-001', 'Aarav Patel', '101', 'Full Package', 45000, 45000, 0, '2026-10-15', 'Paid'),
('f-2', 'STU-2024-002', 'Priya Sharma', '201', 'Rent', 28000, 14000, 14000, '2026-10-20', 'Partial'),
('f-3', 'STU-2024-003', 'Rohan Gupta', '101', 'Mess', 18000, 0, 18000, '2026-10-10', 'Pending');


-- ------------------------------------------------------------
-- 3. USEFUL DBMS QUERIES FOR PRESENTATION & VIVA
-- ------------------------------------------------------------

-- Q1: Fetch all active students along with their hostel and room details
SELECT s.student_id, s.name, s.department, s.hostel_name, s.room_number, s.phone
FROM students s
WHERE s.status = 'Active';

-- Q2: Calculate total beds occupied vs capacity for each hostel (Aggregation & Join)
SELECT h.name AS hostel_name, h.type, h.total_capacity, SUM(r.current_occupancy) AS total_occupied_beds,
       (h.total_capacity - SUM(r.current_occupancy)) AS vacant_beds
FROM hostels h
LEFT JOIN rooms r ON h.id = r.hostel_id
GROUP BY h.id;

-- Q3: Find all students with outstanding/pending fee balances (Defaulter Query)
SELECT f.student_id, f.student_name, f.room_number, f.fee_type, f.pending_amount, f.due_date
FROM fee_records f
WHERE f.pending_amount > 0
ORDER BY f.pending_amount DESC;

-- Q4: Count open complaints grouped by issue category
SELECT category, COUNT(*) AS complaint_count, 
       SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending_count
FROM complaints
GROUP BY category;

-- Q5: List all active visitors currently inside campus
SELECT visitor_name, phone, relation, student_name, purpose, entry_time
FROM visitor_records
WHERE status = 'In Campus';
