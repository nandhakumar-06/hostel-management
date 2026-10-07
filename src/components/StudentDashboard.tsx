import React, { useState } from 'react';
import { useHostel } from '../context/HostelContext';
import {
  GraduationCap,
  Building,
  BedDouble,
  CreditCard,
  AlertCircle,
  Phone,
  Plus,
  Bell,
  X
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { activeStudent, hostels, rooms, fees, complaints, notices, addComplaint } = useHostel();

  const [activeTab, setActiveTab] = useState<'overview' | 'room' | 'fees' | 'complaints' | 'notices'>('overview');
  const [isSubmitComplaintOpen, setIsSubmitComplaintOpen] = useState(false);

  // Form State for Submit Complaint
  const [complaintForm, setComplaintForm] = useState({
    category: 'Wi-Fi' as 'Plumbing' | 'Electrical' | 'Wi-Fi' | 'Cleanliness' | 'Furniture' | 'Other',
    title: '',
    description: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High'
  });

  if (!activeStudent) {
    return (
      <div className="bg-white p-8 rounded-2xl text-center text-brand-subText">
        No active student selected. Please select a student profile from the top navigation bar.
      </div>
    );
  }

  // Related data for active student
  const studentHostel = hostels.find(h => h.id === activeStudent.hostelId || h.name === activeStudent.hostelName);
  const studentRoom = rooms.find(r => r.hostelId === activeStudent.hostelId && r.roomNumber === activeStudent.roomNumber);

  // Roommates
  const roommates = activeStudent.roomNumber
    ? useHostel().students.filter(
        s => s.roomNumber === activeStudent.roomNumber && s.hostelId === activeStudent.hostelId && s.id !== activeStudent.id
      )
    : [];

  // Student Fee Records
  const studentFees = fees.filter(f => f.studentId === activeStudent.studentId || f.studentName === activeStudent.name);
  const totalPendingFee = studentFees.reduce((acc, f) => acc + f.pendingAmount, 0);

  // Student Complaints
  const studentComplaints = complaints.filter(
    c => c.studentId === activeStudent.studentId || c.studentName === activeStudent.name
  );

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintForm.title || !complaintForm.description) return;

    addComplaint({
      studentId: activeStudent.studentId,
      studentName: activeStudent.name,
      roomNumber: activeStudent.roomNumber || 'N/A',
      hostelName: activeStudent.hostelName || 'General',
      category: complaintForm.category,
      title: complaintForm.title,
      description: complaintForm.description,
      priority: complaintForm.priority
    });

    setIsSubmitComplaintOpen(false);
    setComplaintForm({
      category: 'Wi-Fi',
      title: '',
      description: '',
      priority: 'Medium'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Student Welcome Header Card */}
      <div className="bg-gradient-to-r from-brand-primary via-brand-dark to-brand-primary text-white p-6 rounded-2xl shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 bg-brand-accent/20 border border-brand-accent/30 text-white text-xs px-3 py-1 rounded-full mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-brand-accent" />
              <span>Student Resident Portal</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Welcome, {activeStudent.name}</h1>
            <p className="text-xs text-gray-300 mt-1">
              {activeStudent.studentId} • {activeStudent.department} ({activeStudent.year})
            </p>
          </div>

          {/* Quick Room Badge */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 text-right">
            <span className="text-[10px] text-gray-300 uppercase block font-semibold">Assigned Accommodation</span>
            <div className="text-sm font-black text-white mt-0.5">
              {activeStudent.roomNumber
                ? `${activeStudent.hostelName} - Room ${activeStudent.roomNumber}`
                : 'Not Allocated Yet'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-brand-border shadow-sm flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'overview'
              ? 'bg-brand-accent text-white shadow-sm'
              : 'text-brand-subText hover:bg-brand-bg hover:text-brand-mainText'
          }`}
        >
          My Profile & Dashboard
        </button>
        <button
          onClick={() => setActiveTab('room')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'room'
              ? 'bg-brand-accent text-white shadow-sm'
              : 'text-brand-subText hover:bg-brand-bg hover:text-brand-mainText'
          }`}
        >
          Hostel & Room Info
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'fees'
              ? 'bg-brand-accent text-white shadow-sm'
              : 'text-brand-subText hover:bg-brand-bg hover:text-brand-mainText'
          }`}
        >
          My Fee Status ({totalPendingFee > 0 ? `₹${totalPendingFee} Due` : 'Paid'})
        </button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'complaints'
              ? 'bg-brand-accent text-white shadow-sm'
              : 'text-brand-subText hover:bg-brand-bg hover:text-brand-mainText'
          }`}
        >
          Complaints Desk ({studentComplaints.length})
        </button>
        <button
          onClick={() => setActiveTab('notices')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'notices'
              ? 'bg-brand-accent text-white shadow-sm'
              : 'text-brand-subText hover:bg-brand-bg hover:text-brand-mainText'
          }`}
        >
          Hostel Notice Board
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm space-y-4">
            <div className="flex items-center space-x-3 border-b border-brand-border pb-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center text-lg font-black">
                {activeStudent.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-base font-bold text-brand-mainText">{activeStudent.name}</h3>
                <span className="text-xs text-brand-subText font-mono">{activeStudent.studentId}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-brand-border/40">
                <span className="text-brand-subText">Department:</span>
                <span className="font-semibold text-brand-mainText">{activeStudent.department}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-border/40">
                <span className="text-brand-subText">Academic Year:</span>
                <span className="font-semibold text-brand-mainText">{activeStudent.year}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-border/40">
                <span className="text-brand-subText">Email Address:</span>
                <span className="font-semibold text-brand-mainText">{activeStudent.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-border/40">
                <span className="text-brand-subText">Contact Phone:</span>
                <span className="font-semibold text-brand-mainText">{activeStudent.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-border/40">
                <span className="text-brand-subText">Guardian Name:</span>
                <span className="font-semibold text-brand-mainText">{activeStudent.guardianName || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-brand-subText">Emergency Contact:</span>
                <span className="font-bold text-rose-700">{activeStudent.emergencyContact || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Fee & Room Snapshot */}
          <div className="md:col-span-2 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Fee snapshot */}
              <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-brand-subText uppercase">Fee Payment Balance</span>
                  <h4 className="text-2xl font-black text-brand-mainText mt-1">
                    ₹{totalPendingFee.toLocaleString()}
                  </h4>
                  <p className="text-xs text-brand-subText mt-1">
                    {totalPendingFee === 0 ? 'All fees cleared!' : 'Pending payment due soon.'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('fees')}
                  className="mt-4 text-xs font-bold text-brand-accent hover:underline text-left"
                >
                  View Fee Breakdown →
                </button>
              </div>

              {/* Complaints snapshot */}
              <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-brand-subText uppercase">My Active Complaints</span>
                  <h4 className="text-2xl font-black text-brand-mainText mt-1">{studentComplaints.length}</h4>
                  <p className="text-xs text-brand-subText mt-1">Reported issues in tracking</p>
                </div>
                <button
                  onClick={() => setIsSubmitComplaintOpen(true)}
                  className="mt-4 bg-brand-accent hover:bg-brand-accentHover text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Submit New Complaint</span>
                </button>
              </div>

            </div>

            {/* Warden Contact Card */}
            {studentHostel && (
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-emerald-900 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Hostel Warden Contact</span>
                  <h4 className="text-base font-extrabold mt-0.5">{studentHostel.wardenName}</h4>
                  <p className="text-xs text-emerald-700">{studentHostel.name} ({studentHostel.code})</p>
                </div>
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm text-xs font-bold text-emerald-800 border border-emerald-200">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>{studentHostel.wardenPhone}</span>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ROOM & HOSTEL TAB */}
      {activeTab === 'room' && (
        <div className="space-y-6">
          {studentHostel ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Room details card */}
              <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-brand-mainText flex items-center space-x-2">
                  <BedDouble className="w-5 h-5 text-brand-accent" />
                  <span>My Allocated Room</span>
                </h3>

                <div className="bg-brand-bg p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-brand-subText">Hostel Block:</span>
                    <span className="font-bold text-brand-mainText">{studentHostel.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-subText">Room Number:</span>
                    <span className="font-bold text-brand-accent">Room {activeStudent.roomNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-subText">Floor Level:</span>
                    <span className="font-semibold text-brand-mainText">Floor {studentRoom?.floor || 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-subText">Room Layout Type:</span>
                    <span className="font-semibold text-brand-mainText">{studentRoom?.type || 'Double'}</span>
                  </div>
                </div>

                {/* Roommates */}
                <div>
                  <h4 className="text-xs font-bold text-brand-mainText mb-2">My Roommates ({roommates.length})</h4>
                  {roommates.length === 0 ? (
                    <p className="text-xs text-brand-subText italic">No other assigned roommates in this room.</p>
                  ) : (
                    <div className="space-y-2">
                      {roommates.map(rm => (
                        <div key={rm.id} className="p-3 bg-brand-bg rounded-xl border border-brand-border flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-brand-mainText">{rm.name}</div>
                            <div className="text-[10px] text-brand-subText">{rm.department} • {rm.year}</div>
                          </div>
                          <span className="text-[10px] text-brand-subText">{rm.phone}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Hostel Facilities card */}
              <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-brand-mainText flex items-center space-x-2">
                  <Building className="w-5 h-5 text-brand-accent" />
                  <span>Hostel Amenities & Information</span>
                </h3>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-brand-subText uppercase">Provided Facilities</div>
                  <div className="flex flex-wrap gap-2">
                    {studentHostel.amenities.map((item, idx) => (
                      <span key={idx} className="bg-brand-accent/15 text-brand-accent px-3 py-1 rounded-xl text-xs font-bold border border-brand-accent/30">
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-brand-border pt-3 space-y-2 text-xs">
                  <span className="font-semibold text-brand-subText uppercase block">Warden Office Hours</span>
                  <p className="text-brand-mainText">Monday – Saturday: 9:00 AM – 6:00 PM</p>
                  <p className="text-brand-subText">Emergency Warden Phone: <strong>{studentHostel.wardenPhone}</strong></p>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl text-center text-brand-subText text-xs">
              No hostel allocation found for your student profile yet. Please contact the hostel warden.
            </div>
          )}
        </div>
      )}

      {/* FEE STATUS TAB */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-bold text-brand-mainText flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-brand-accent" />
            <span>My Fee Status Ledger</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brand-bg/80 border-b border-brand-border text-[11px] font-bold text-brand-subText uppercase">
                  <th className="py-3 px-4">Fee Description</th>
                  <th className="py-3 px-4">Total Fee Amount</th>
                  <th className="py-3 px-4">Paid Amount</th>
                  <th className="py-3 px-4">Pending Balance</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {studentFees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-brand-subText">
                      No fee invoices logged for your record.
                    </td>
                  </tr>
                ) : (
                  studentFees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-brand-bg/50">
                      <td className="py-3 px-4 font-bold text-brand-mainText">{fee.feeType}</td>
                      <td className="py-3 px-4 font-semibold">₹{fee.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-emerald-700 font-semibold">₹{fee.paidAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-amber-700 font-bold">₹{fee.pendingAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-brand-subText">{fee.dueDate}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            fee.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          {fee.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COMPLAINTS TAB */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-brand-border">
            <h3 className="text-base font-bold text-brand-mainText">Lodge & Track Complaints</h3>
            <button
              onClick={() => setIsSubmitComplaintOpen(true)}
              className="bg-brand-accent hover:bg-brand-accentHover text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Issue</span>
            </button>
          </div>

          <div className="space-y-3">
            {studentComplaints.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-brand-border text-center text-brand-subText text-xs">
                You haven't reported any issues yet. Click "Submit New Issue" if you face maintenance or facility problems.
              </div>
            ) : (
              studentComplaints.map((c) => (
                <div key={c.id} className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase bg-brand-bg px-2 py-0.5 rounded border border-brand-border text-brand-mainText">
                        {c.category}
                      </span>
                      <h4 className="text-sm font-bold text-brand-mainText">{c.title}</h4>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        c.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : c.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <p className="text-xs text-brand-mainText">{c.description}</p>

                  {c.adminNote && (
                    <div className="bg-brand-bg p-3 rounded-xl border border-brand-accent/30 text-xs">
                      <strong className="text-brand-accent block">Warden Update:</strong>
                      <p className="text-brand-mainText italic mt-0.5">{c.adminNote}</p>
                    </div>
                  )}

                  <div className="text-[11px] text-brand-subText pt-1">
                    Submitted on: {c.createdAt}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* NOTICES TAB */}
      {activeTab === 'notices' && (
        <div className="space-y-3">
          {notices.map((n) => (
            <div key={n.id} className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-brand-mainText flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-brand-accent" />
                  <span>{n.title}</span>
                </h4>
                <span className="text-[11px] text-brand-subText">{n.date}</span>
              </div>
              <p className="text-xs text-brand-mainText leading-relaxed">{n.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: SUBMIT COMPLAINT */}
      {isSubmitComplaintOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-brand-border space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="text-lg font-bold text-brand-mainText flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-brand-accent" />
                <span>Submit Hostel Complaint</span>
              </h3>
              <button onClick={() => setIsSubmitComplaintOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitComplaint} className="space-y-3 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Issue Category</label>
                  <select
                    value={complaintForm.category}
                    onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg text-brand-mainText"
                  >
                    <option value="Wi-Fi">Wi-Fi / Network</option>
                    <option value="Plumbing">Plumbing / Tap</option>
                    <option value="Electrical">Electrical / Light</option>
                    <option value="Cleanliness">Cleanliness</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Urgency Priority</label>
                  <select
                    value={complaintForm.priority}
                    onChange={(e) => setComplaintForm({ ...complaintForm, priority: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg text-brand-mainText"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Urgency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-brand-mainText block mb-1">Complaint Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bathroom tap leaking water"
                  value={complaintForm.title}
                  onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg text-brand-mainText"
                />
              </div>

              <div>
                <label className="font-semibold text-brand-mainText block mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the issue clearly..."
                  value={complaintForm.description}
                  onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg text-brand-mainText"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitComplaintOpen(false)}
                  className="px-4 py-2 rounded-xl text-brand-subText hover:bg-brand-bg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-accent hover:bg-brand-accentHover text-white rounded-xl font-bold shadow-sm"
                >
                  Submit Issue
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
