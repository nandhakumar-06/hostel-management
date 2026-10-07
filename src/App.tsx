import React, { useState } from 'react';
import { HostelProvider, useHostel } from './context/HostelContext';
import { Navbar } from './components/Navbar';
import { SidebarNav } from './components/SidebarNav';
import type { AdminTab } from './components/SidebarNav';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentManagement } from './components/StudentManagement';
import { HostelManagement } from './components/HostelManagement';
import { RoomManagement } from './components/RoomManagement';
import { RoomAllocation } from './components/RoomAllocation';
import { FeeManagement } from './components/FeeManagement';
import { ComplaintManagement } from './components/ComplaintManagement';
import { VisitorManagement } from './components/VisitorManagement';
import { ReportsAnalytics } from './components/ReportsAnalytics';
import { StudentDashboard } from './components/StudentDashboard';

const MainLayout: React.FC = () => {
  const { role, complaints, visitors } = useHostel();
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('dashboard');

  const pendingComplaintsCount = complaints.filter(c => c.status === 'Pending').length;
  const activeVisitorsCount = visitors.filter(v => v.status === 'In Campus').length;

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans text-brand-mainText">
      
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {role === 'admin' ? (
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Sidebar Navigation */}
            <SidebarNav
              activeTab={activeAdminTab}
              setActiveTab={setActiveAdminTab}
              pendingComplaintsCount={pendingComplaintsCount}
              activeVisitorsCount={activeVisitorsCount}
            />

            {/* Dynamic View Component */}
            <div className="flex-1 min-w-0">
              {activeAdminTab === 'dashboard' && <AdminDashboard setActiveTab={setActiveAdminTab} />}
              {activeAdminTab === 'students' && <StudentManagement />}
              {activeAdminTab === 'hostels' && <HostelManagement />}
              {activeAdminTab === 'rooms' && <RoomManagement />}
              {activeAdminTab === 'allocations' && <RoomAllocation />}
              {activeAdminTab === 'fees' && <FeeManagement />}
              {activeAdminTab === 'complaints' && <ComplaintManagement />}
              {activeAdminTab === 'visitors' && <VisitorManagement />}
              {activeAdminTab === 'reports' && <ReportsAnalytics />}
            </div>

          </div>
        ) : (
          <StudentDashboard />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-brand-border py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-brand-subText flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>HostelSync Pro</strong> • Complete Residence & Student Management System
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#4F8A89]" title="Muted Teal Accent" />
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#263238]" title="Deep Slate Primary" />
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#78909C]" title="Soft Sage Secondary" />
            <span>Deployable to GitHub & Vercel</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <HostelProvider>
      <MainLayout />
    </HostelProvider>
  );
}
