-- Hostel Management System (HostelSync Pro)
-- PostgreSQL / Supabase Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. HOSTELS TABLE
CREATE TABLE IF NOT EXISTS hostels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) CHECK (type IN ('Boys', 'Girls', 'Co-ed')),
    total_rooms INT DEFAULT 0,
    total_capacity INT DEFAULT 0,
    occupied_beds INT DEFAULT 0,
    warden_name VARCHAR(255) NOT NULL,
    warden_phone VARCHAR(50) NOT NULL,
    amenities TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ROOMS TABLE
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hostel_id UUID REFERENCES hostels(id) ON DELETE CASCADE,
    hostel_name VARCHAR(255) NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    floor INT DEFAULT 1,
    type VARCHAR(20) CHECK (type IN ('Single', 'Double', 'Triple')),
    capacity INT DEFAULT 2,
    current_occupancy INT DEFAULT 0,
    rent_per_month NUMERIC(10, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Available' CHECK (status IN ('Available', 'Full', 'Maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(hostel_id, room_number)
);

-- 3. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    hostel_id UUID REFERENCES hostels(id) ON DELETE SET NULL,
    hostel_name VARCHAR(255),
    room_number VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    guardian_name VARCHAR(255),
    emergency_contact VARCHAR(50),
    joined_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. FEES TABLE
CREATE TABLE IF NOT EXISTS fee_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    room_number VARCHAR(50),
    fee_type VARCHAR(50) CHECK (fee_type IN ('Rent', 'Mess', 'Security', 'Full Package')),
    total_amount NUMERIC(10, 2) NOT NULL,
    paid_amount NUMERIC(10, 2) DEFAULT 0,
    pending_amount NUMERIC(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Paid', 'Pending', 'Partial')),
    last_payment_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    room_number VARCHAR(50),
    hostel_name VARCHAR(255),
    category VARCHAR(50) CHECK (category IN ('Plumbing', 'Electrical', 'Wi-Fi', 'Cleanliness', 'Furniture', 'Other')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved')),
    admin_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. VISITORS TABLE
CREATE TABLE IF NOT EXISTS visitor_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visitor_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    relation VARCHAR(100) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    purpose TEXT NOT NULL,
    entry_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    exit_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'In Campus' CHECK (status IN ('In Campus', 'Checked Out')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. NOTICES TABLE
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    notice_date DATE DEFAULT CURRENT_DATE,
    target VARCHAR(50) DEFAULT 'All',
    priority VARCHAR(20) DEFAULT 'Normal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SEED DATA INSERTS
INSERT INTO hostels (id, name, code, type, total_rooms, total_capacity, occupied_beds, warden_name, warden_phone, amenities)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'North Star Residence', 'NSR-BLOCK-A', 'Boys', 40, 80, 54, 'Dr. Rajesh Verma', '+91 98765 43210', ARRAY['Wi-Fi 6', '24/7 Power Backup', 'Study Lounge', 'Gym']),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Lotus Heights', 'LTH-BLOCK-B', 'Girls', 35, 70, 48, 'Mrs. Sunita Sharma', '+91 98765 12345', ARRAY['Wi-Fi 6', 'Security Guards', 'Badminton Court', 'Library']);
