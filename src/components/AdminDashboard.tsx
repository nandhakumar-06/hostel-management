import React from 'react';
import { useHostel } from '../context/HostelContext';
import type { AdminTab } from './SidebarNav';
import {
  Users,
  Building,
  BedDouble,
  CreditCard,
  AlertCircle,
  UserCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface AdminDashboardProps {
  setActiveTab: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveTab }) => {
  const { hostels, students, fees, complaints, visitors } = useHostel();

  // Calculations
  const totalCapacity = hostels.reduce((acc, h) => acc + h.totalCapacity, 0);
  const totalOccupiedBeds = hostels.reduce((acc, h) => acc + h.occupiedBeds, 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupiedBeds / totalCapacity) * 100) : 0;

  const totalStudents = students.length;
  const allocatedStudents = students.filter(s => s.roomNumber).length;
  const unallocatedStudents = totalStudents - allocatedStudents;

  const totalPendingFee = fees.reduce((acc, f) => acc + f.pendingAmount, 0);
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;

  const activeVisitors = visitors.filter(v => v.status === 'In Campus').length;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-primary via-brand-dark to-brand-primary text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-brand-accent/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-brand-accent/20 border border-brand-accent/30 text-white text-xs px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              <span>Hostel Management System Overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, Hostel Administrator
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              Monitor room occupancy, track student allocations, manage fee payments, and resolve complaints efficiently.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('allocations')}
              className="bg-brand-accent hover:bg-brand-accentHover text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center space-x-2"
            >
              <span>Allocate Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Occupancy Card */}
        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brand-subText uppercase tracking-wider">Total Occupancy</p>
            <h3 className="text-2xl font-bold text-brand-mainText mt-1">{occupancyRate}%</h3>
            <p className="text-xs text-brand-subText mt-1">
              <span className="font-semibold text-brand-accent">{totalOccupiedBeds}</span> / {totalCapacity} beds occupied
            </p>
          </div>
          <div className="bg-brand-accent/15 p-3 rounded-xl text-brand-accent">
            <BedDouble className="w-6 h-6" />
          </div>
        </div>

        {/* Total Students Card */}
        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brand-subText uppercase tracking-wider">Total Students</p>
            <h3 className="text-2xl font-bold text-brand-mainText mt-1">{totalStudents}</h3>
            <p className="text-xs text-brand-subText mt-1">
              <span className="font-semibold text-green-600">{allocatedStudents}</span> allocated, {unallocatedStudents} pending
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Fee Collection Card */}
        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brand-subText uppercase tracking-wider">Pending Fees</p>
            <h3 className="text-2xl font-bold text-brand-warning mt-1">₹{totalPendingFee.toLocaleString()}</h3>
            <p className="text-xs text-brand-subText mt-1">
              Across {fees.filter(f => f.pendingAmount > 0).length} student records
            </p>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl text-brand-warning">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Complaints Card */}
        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brand-subText uppercase tracking-wider">Open Complaints</p>
            <h3 className="text-2xl font-bold text-brand-error mt-1">{pendingComplaints + inProgressComplaints}</h3>
            <p className="text-xs text-brand-subText mt-1">
              {pendingComplaints} Pending, {inProgressComplaints} In Progress
            </p>
          </div>
          <div className="bg-rose-50 p-3 rounded-xl text-brand-error">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Middle Visual Section: Hostel Occupancy Bars & Complaints Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hostel Capacity Progress */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-brand-mainText">Hostel Occupancy Distribution</h3>
              <p className="text-xs text-brand-subText">Real-time bed utilization across hostels</p>
            </div>
            <button
              onClick={() => setActiveTab('hostels')}
              className="text-xs font-semibold text-brand-accent hover:underline flex items-center space-x-1"
            >
              <span>Manage Hostels</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {hostels.map((hostel) => {
              const pct = hostel.totalCapacity > 0 ? Math.round((hostel.occupiedBeds / hostel.totalCapacity) * 100) : 0;
              return (
                <div key={hostel.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-brand-mainText flex items-center space-x-2">
                      <Building className="w-3.5 h-3.5 text-brand-accent" />
                      <span>{hostel.name} ({hostel.code})</span>
                    </span>
                    <span className="text-brand-subText">
                      {hostel.occupiedBeds} / {hostel.totalCapacity} Beds ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-brand-bg rounded-full overflow-hidden border border-brand-border/60">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        pct > 90 ? 'bg-rose-500' : pct > 70 ? 'bg-amber-500' : 'bg-brand-accent'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex text-[11px] text-brand-subText gap-4">
                    <span>Type: <strong className="text-brand-mainText">{hostel.type}</strong></span>
                    <span>Warden: <strong className="text-brand-mainText">{hostel.wardenName}</strong></span>
                    <span>Amenities: <strong className="text-brand-mainText">{hostel.amenities.slice(0, 2).join(', ')}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Action Hub & Visitor Widget */}
        <div className="space-y-6">
          
          {/* Active Visitors Summary */}
          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-brand-accent" />
                <h4 className="text-sm font-bold text-brand-mainText">Campus Visitors Today</h4>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {activeVisitors} Active
              </span>
            </div>
            <p className="text-xs text-brand-subText mb-4">
              Visitors logged in campus who haven't checked out yet.
            </p>
            <button
              onClick={() => setActiveTab('visitors')}
              className="w-full bg-brand-bg hover:bg-brand-accent/10 text-brand-accent font-semibold text-xs py-2 rounded-xl border border-brand-accent/30 transition flex items-center justify-center space-x-2"
            >
              <span>View Visitor Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Complaint Status Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm">
            <h4 className="text-sm font-bold text-brand-mainText mb-3">Complaint Resolution Summary</h4>
            <div className="space-y-2.5 text-xs font-medium">
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                <span className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Pending Action</span>
                </span>
                <span className="font-bold">{pendingComplaints}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                <span className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>In Progress</span>
                </span>
                <span className="font-bold">{inProgressComplaints}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Resolved</span>
                </span>
                <span className="font-bold">{resolvedComplaints}</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('complaints')}
              className="w-full mt-3 text-center text-xs font-semibold text-brand-accent hover:underline block"
            >
              Go to Complaint Desk →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
