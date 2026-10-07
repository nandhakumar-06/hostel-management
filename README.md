# HostelSync Pro — Modern Hostel Management System

A full-featured, responsive, state-of-the-art **Hostel Management System** built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**, featuring Supabase integration and offline demo mode.

---

## 🎨 Color Palette & Design System

The application strictly implements the requested modern color palette:

| Purpose | Color Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | Deep Slate | `#263238` | Navbar, Headers, Dark Buttons |
| **Primary Dark** | Dark Navy Slate | `#1B2529` | Hero banners, Gradient accents |
| **Accent** | Muted Teal | `#4F8A89` | Primary action buttons, Active pills, Badges |
| **Secondary** | Soft Sage | `#78909C` | Sub-texts, Minor borders, Helper labels |
| **Background** | Warm Off-White | `#F5F6F4` | Global body background |
| **Card** | White | `#FFFFFF` | Form cards, Tables, Modal overlays |
| **Main Text** | Charcoal | `#263238` | Headings, Primary typography |
| **Secondary Text** | Grey | `#667085` | Subtitles, Table headers |
| **Border** | Light Grey | `#D9DEDF` | Card dividers, Input borders |
| **Success** | Muted Green | `#5F8068` | Occupancy success, Paid statuses |
| **Warning** | Muted Amber | `#A9824A` | Partial fees, Maintenance badges |
| **Error** | Muted Red | `#A65D5D` | Pending fees, High-priority complaints |

---

## 🚀 Key Modules & Functional Features

### 🏢 1. Hostel Management
- **Add Hostel**: Specify Hostel Name, Block Code, Type (`Boys`, `Girls`, `Co-ed`), Total Rooms, Total Capacity, Warden Name & Phone, and Amenities.
- **View Hostel Cards**: Visual progress bar representing bed occupancy rates per block.
- **Edit & Delete Hostel**: Full CRUD with safety confirmation dialogs.

### 🛏️ 2. Room Management
- **Add & Edit Rooms**: Configure Floor Level, Room Type (`Single`, `Double`, `Triple`), Capacity, Monthly Rent, and Status.
- **Occupancy & Availability Tracking**: Real-time counters for Total Rooms, Available Rooms, Full Capacity, and Under Maintenance.

### 🔑 3. Room Allocation Engine
- **Capacity Check**: Real-time validation preventing over-allocation past room limits.
- **Allocate Student**: Assign unallocated students to available beds in any hostel block.
- **Vacate Bed**: One-click bed freeing and room status auto-adjustment.
- **Track Occupants**: Searchable occupant directory by room and block.

### 👥 4. Student Management
- **Add, View, Search, Edit, Delete**: Comprehensive student directory.
- **Student Profile Drawer**: Quick view for emergency contact, guardian name, academic year, and room assignment.
- **Search & Filter**: Filter by department, room allocation status, or search query.

### 💳 5. Fee Management
- **Ledger Overview**: Total Invoiced, Total Collected, and Outstanding Balances.
- **Fee Record Creation**: Supports Full Package, Rent, Mess, and Security deposits.
- **Record Payments**: Partial or full payment processing with automatic balance recalculation (`Paid`, `Pending`, `Partial`).

### 🛠️ 6. Complaint Helpdesk
- **Student Lodge Issue**: Category selection (`Wi-Fi`, `Plumbing`, `Electrical`, `Cleanliness`, `Furniture`, `Other`), Priority levels, and descriptions.
- **Admin Helpdesk Workflow**: Advance complaint status: `Pending` → `In Progress` → `Resolved`.
- **Warden Notes**: Admin can attach resolution notes for student tracking.

### 🚪 7. Visitor Entry Log
- **Log Visitor Entry**: Visitor name, phone, relation, student association, purpose, and entry time.
- **Live Campus Monitor**: Active visitor badge and one-click **Check Out** action.

### 📊 8. Reports & Data Analytics
- **Occupancy & Capacity Report**
- **Students by Department Distribution**
- **Pending Fee Defaulters List**
- **Complaint Category & Resolution Statistics**
- **Visitor Security Logs**
- **CSV Data Exporter**: 1-click download of all report datasets.

### 🎓 9. Student Portal (Role Switcher)
- Quick toggle between **Admin** and **Student** roles in the top navbar.
- View assigned room, hostel details, roommate info, warden contact details.
- View fee balance ledger and lodge/track personal complaints.

---

## 📦 How to Deploy on GitHub & Vercel

### Step 1: Push Project to GitHub

1. Open terminal in the project directory (`c:\hostel management`).
2. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of HostelSync Pro"
   ```
3. Create a new repository on [GitHub](https://github.com/new).
4. Link and push your repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/hostel-management.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 2: Deploy to Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** → **Project**.
3. Import your GitHub repository (`hostel-management`).
4. Keep framework set to **Vite**.
5. *(Optional)* Add Environment Variables under Project Settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **Deploy**. Vercel will build and publish your site!

---

## 🛢️ Supabase Integration (Optional Backend Setup)

1. Create a project at [Supabase](https://supabase.com).
2. Go to **SQL Editor** and run the contents of `schema.sql`.
3. Copy your project URL and Anon Key into `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. When credentials are set, Supabase live sync will activate! If credentials are not set, the app seamlessly runs in interactive local storage mode.

---

## 💻 Local Development Commands

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build production bundle
npm run build
```
