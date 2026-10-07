import express from 'express';
import cors from 'cors';
import { query, run } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// API Endpoints for SQLite Database hostel.db

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'hostel.db' });
});

// 2. Students API
app.get('/api/students', async (req, res) => {
  try {
    const students = await query('SELECT * FROM students ORDER BY created_at DESC');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { id, student_id, name, email, phone, department, year, hostel_id, hostel_name, room_number, status, guardian_name, emergency_contact, joined_date } = req.body;
    await run(
      `INSERT INTO students (id, student_id, name, email, phone, department, year, hostel_id, hostel_name, room_number, status, guardian_name, emergency_contact, joined_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id || `s-${Date.now()}`, student_id, name, email, phone, department, year, hostel_id || null, hostel_name || null, room_number || null, status || 'Active', guardian_name, emergency_contact, joined_date]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Hostels API
app.get('/api/hostels', async (req, res) => {
  try {
    const hostels = await query('SELECT * FROM hostels');
    res.json(hostels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Rooms API
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await query('SELECT * FROM rooms');
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Fees API
app.get('/api/fees', async (req, res) => {
  try {
    const fees = await query('SELECT * FROM fee_records ORDER BY created_at DESC');
    res.json(fees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Complaints API
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await query('SELECT * FROM complaints ORDER BY created_at DESC');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Visitors API
app.get('/api/visitors', async (req, res) => {
  try {
    const visitors = await query('SELECT * FROM visitor_records ORDER BY created_at DESC');
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`HostelSync SQLite Express Server running at http://localhost:${PORT}`);
});
