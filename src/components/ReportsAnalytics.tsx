import React, { useState } from 'react';
import { useHostel } from '../context/HostelContext';
import {
  BarChart3,
  Download,
  Building,
  Users,
  CreditCard,
  AlertCircle,
  UserCheck
} from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const { hostels, students, fees, complaints, visitors } = useHostel();

  const [activeReportTab, setActiveReportTab] = useState<
    'occupancy' | 'department' | 'fees' | 'complaints' | 'visitors'
  >('occupancy');

  // CSV Exporter Helper Function
  const exportCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.map(item => `"${item}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Grouping Calculations
  const deptCountMap: Record<string, number> = {};
  students.forEach(s => {
    deptCountMap[s.department] = (deptCountMap[s.department] || 0) + 1;
  });

  const pendingFeeRecords = fees.filter(f => f.pendingAmount > 0);

  const complaintCatMap: Record<string, number> = {};
  complaints.forEach(c => {
    complaintCatMap[c.category] = (complaintCatMap[c.category] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-brand-mainText flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-brand-accent" />
            <span>Reports & Institutional Analytics</span>
          </h2>
          <p className="text-xs text-brand-subText mt-1">
            Generate and export full analytical reports on hostel occupancy, fee collections, student demographics, and complaints.
          </p>
        </div>
      </div>

      {/* Report Sub-Tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-brand-border shadow-sm flex flex-wrap gap-2">
        <button
          onClick={() => setActiveReportTab('occupancy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeReportTab === 'occupancy'
              ? 'bg-brand-primary text-white shadow-sm'
              : 'text-brand-subText hover:bg-brand-bg hover:text-brand-mainText'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Hostel Occupancy Report</span>
        </button>

        <button
          onClick={() => setActiveReportTab('department')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeReportTab === 'department'
              ? 'bg-brand-primary text-white shadow-sm'
              : 'text-brand-subText hover:bg-brand-bg hover:text-brand-mainText'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Students by Department</span>
        </button>

        <button
          onClick={() => setActiveReportTab('fees')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeReportTab === 'fees'
              ? 'bg-brand-primary text-white shadow-sm'
              : 'text-brand-subText hover:bg-brand-bg hover:text-brand-mainText'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Pending Fees Ledger</span>
        </button>

        <button
          onClick={() => setActiveReportTab('complaints')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeReportTab === 'complaints'
              ? 'bg-brand-primary text-white shadow-sm'
              : 'text-brand-subText hover:bg-brand-bg hover:text-brand-mainText'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Complaint Statistics</span>
        </button>

        <button
          onClick={() => setActiveReportTab('visitors')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeReportTab === 'visitors'
              ? 'bg-brand-primary text-white shadow-sm'
              : 'text-brand-subText hover:bg-brand-bg hover:text-brand-mainText'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Visitor Records</span>
        </button>
      </div>

      {/* TAB 1: HOSTEL OCCUPANCY REPORT */}
      {activeReportTab === 'occupancy' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-brand-border">
            <h3 className="text-base font-bold text-brand-mainText">Hostel & Room Capacity Analysis</h3>
            <button
              onClick={() =>
                exportCSV(
                  'hostel_occupancy_report',
                  ['Hostel Code', 'Hostel Name', 'Type', 'Total Rooms', 'Capacity Beds', 'Occupied Beds', 'Vacant Beds', 'Warden'],
                  hostels.map(h => [
                    h.code,
                    h.name,
                    h.type,
                    h.totalRooms,
                    h.totalCapacity,
                    h.occupiedBeds,
                    h.totalCapacity - h.occupiedBeds,
                    h.wardenName
                  ])
                )
              }
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brand-bg/80 border-b border-brand-border text-[11px] font-bold text-brand-subText uppercase">
                  <th className="py-3 px-4">Hostel Block</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Total Rooms</th>
                  <th className="py-3 px-4">Capacity Beds</th>
                  <th className="py-3 px-4">Occupied Beds</th>
                  <th className="py-3 px-4">Available Vacant Beds</th>
                  <th className="py-3 px-4">Occupancy Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {hostels.map(h => {
                  const pct = h.totalCapacity > 0 ? Math.round((h.occupiedBeds / h.totalCapacity) * 100) : 0;
                  return (
                    <tr key={h.id} className="hover:bg-brand-bg/50">
                      <td className="py-3 px-4 font-bold text-brand-mainText">
                        {h.name} ({h.code})
                      </td>
                      <td className="py-3 px-4 font-semibold text-brand-subText">{h.type}</td>
                      <td className="py-3 px-4">{h.totalRooms}</td>
                      <td className="py-3 px-4 font-bold">{h.totalCapacity}</td>
                      <td className="py-3 px-4 font-bold text-brand-accent">{h.occupiedBeds}</td>
                      <td className="py-3 px-4 font-bold text-emerald-700">{h.totalCapacity - h.occupiedBeds}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-brand-mainText">{pct}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENTS BY DEPARTMENT */}
      {activeReportTab === 'department' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-brand-border">
            <h3 className="text-base font-bold text-brand-mainText">Departmental Demographics Breakdown</h3>
            <button
              onClick={() =>
                exportCSV(
                  'students_by_department',
                  ['Department', 'Total Students Enrolled', 'Percentage of Total'],
                  Object.entries(deptCountMap).map(([dept, count]) => [
                    dept,
                    count,
                    `${Math.round((count / students.length) * 100)}%`
                  ])
                )
              }
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(deptCountMap).map(([dept, count]) => {
              const pct = Math.round((count / students.length) * 100);
              return (
                <div key={dept} className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-brand-mainText text-sm">{dept}</span>
                    <span className="text-brand-accent font-extrabold">{count} Students ({pct}%)</span>
                  </div>
                  <div className="w-full h-3 bg-brand-bg rounded-full overflow-hidden border border-brand-border">
                    <div className="h-full bg-brand-accent" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PENDING FEES LEDGER */}
      {activeReportTab === 'fees' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-brand-border">
            <h3 className="text-base font-bold text-brand-mainText">Outstanding Fee Defaulters List</h3>
            <button
              onClick={() =>
                exportCSV(
                  'pending_fees_report',
                  ['Student ID', 'Student Name', 'Room', 'Fee Category', 'Total Amount', 'Paid Amount', 'Pending Balance', 'Due Date'],
                  pendingFeeRecords.map(f => [
                    f.studentId,
                    f.studentName,
                    f.roomNumber,
                    f.feeType,
                    f.totalAmount,
                    f.paidAmount,
                    f.pendingAmount,
                    f.dueDate
                  ])
                )
              }
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brand-bg/80 border-b border-brand-border text-[11px] font-bold text-brand-subText uppercase">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Room Number</th>
                  <th className="py-3 px-4">Fee Type</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Pending Outstanding</th>
                  <th className="py-3 px-4">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {pendingFeeRecords.map(f => (
                  <tr key={f.id} className="hover:bg-brand-bg/50">
                    <td className="py-3 px-4 font-bold text-brand-mainText">{f.studentName}</td>
                    <td className="py-3 px-4 text-brand-subText">{f.studentId}</td>
                    <td className="py-3 px-4 font-semibold">Rm {f.roomNumber}</td>
                    <td className="py-3 px-4">{f.feeType}</td>
                    <td className="py-3 px-4 font-bold">₹{f.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-amber-700">₹{f.pendingAmount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-brand-subText">{f.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: COMPLAINT STATISTICS */}
      {activeReportTab === 'complaints' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-brand-border">
            <h3 className="text-base font-bold text-brand-mainText">Complaint Resolution & Category Breakdown</h3>
            <button
              onClick={() =>
                exportCSV(
                  'complaint_statistics_report',
                  ['Complaint ID', 'Title', 'Category', 'Student', 'Room', 'Priority', 'Status', 'Created At'],
                  complaints.map(c => [
                    c.id,
                    c.title,
                    c.category,
                    c.studentName,
                    c.roomNumber,
                    c.priority,
                    c.status,
                    c.createdAt
                  ])
                )
              }
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(complaintCatMap).map(([cat, count]) => (
              <div key={cat} className="bg-white p-4 rounded-2xl border border-brand-border shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-brand-subText uppercase">{cat} Issues</span>
                  <h4 className="text-xl font-extrabold text-brand-mainText mt-1">{count} Complaints</h4>
                </div>
                <div className="bg-brand-accent/15 p-3 rounded-xl text-brand-accent">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: VISITOR RECORDS */}
      {activeReportTab === 'visitors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-brand-border">
            <h3 className="text-base font-bold text-brand-mainText">Comprehensive Visitor Security Log</h3>
            <button
              onClick={() =>
                exportCSV(
                  'visitor_records_report',
                  ['Visitor Name', 'Phone', 'Relation', 'Student Visited', 'Purpose', 'Entry Time', 'Exit Time', 'Status'],
                  visitors.map(v => [
                    v.visitorName,
                    v.phone,
                    v.relation,
                    v.studentName,
                    v.purpose,
                    v.entryTime,
                    v.exitTime || 'N/A',
                    v.status
                  ])
                )
              }
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brand-bg/80 border-b border-brand-border text-[11px] font-bold text-brand-subText uppercase">
                  <th className="py-3 px-4">Visitor Name</th>
                  <th className="py-3 px-4">Phone & Relation</th>
                  <th className="py-3 px-4">Student Associated</th>
                  <th className="py-3 px-4">Entry Time</th>
                  <th className="py-3 px-4">Exit Time</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {visitors.map(v => (
                  <tr key={v.id} className="hover:bg-brand-bg/50">
                    <td className="py-3 px-4 font-bold text-brand-mainText">{v.visitorName}</td>
                    <td className="py-3 px-4 text-brand-subText">{v.phone} ({v.relation})</td>
                    <td className="py-3 px-4 font-semibold">{v.studentName}</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">{v.entryTime}</td>
                    <td className="py-3 px-4 text-rose-700 font-semibold">{v.exitTime || '-'}</td>
                    <td className="py-3 px-4 font-bold">{v.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
