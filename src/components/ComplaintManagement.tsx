import React, { useState } from 'react';
import { useHostel } from '../context/HostelContext';
import type { Complaint } from '../types';
import {
  AlertCircle,
  Search,
  MessageSquare,
  X
} from 'lucide-react';

export const ComplaintManagement: React.FC = () => {
  const { complaints, updateComplaintStatus } = useHostel();

  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [targetStatus, setTargetStatus] = useState<'Pending' | 'In Progress' | 'Resolved'>('In Progress');

  const categories = Array.from(new Set(complaints.map(c => c.category)));

  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatus = statusFilter === 'All' || complaint.status === statusFilter;
    const matchesCat = categoryFilter === 'All' || complaint.category === categoryFilter;
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCat && matchesSearch;
  });

  const handleOpenStatusModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setAdminNote(complaint.adminNote || '');
    setTargetStatus(complaint.status);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    updateComplaintStatus(selectedComplaint.id, targetStatus, adminNote);
    setSelectedComplaint(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-brand-mainText flex items-center space-x-2">
            <AlertCircle className="w-6 h-6 text-brand-accent" />
            <span>Complaint Helpdesk & Status Tracking</span>
          </h2>
          <p className="text-xs text-brand-subText mt-1">
            Review student grievances, assign staff, and update complaint status from Pending → In Progress → Resolved.
          </p>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-sm flex flex-wrap items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-brand-subText absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search complaint title, student or issue description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-brand-bg rounded-xl border border-brand-border focus:outline-none focus:border-brand-accent text-brand-mainText"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-brand-bg px-3 py-2 rounded-xl border border-brand-border text-brand-mainText"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-brand-bg px-3 py-2 rounded-xl border border-brand-border text-brand-mainText"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

        </div>

      </div>

      {/* Complaints Feed List */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-brand-border text-center text-brand-subText text-xs">
            No complaints found matching selected criteria.
          </div>
        ) : (
          filteredComplaints.map((c) => {
            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-brand-border shadow-sm p-5 space-y-3 hover:shadow-md transition"
              >
                
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-border/60 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase bg-brand-bg text-brand-mainText px-2 py-0.5 rounded border border-brand-border">
                      {c.category}
                    </span>
                    <h3 className="text-base font-bold text-brand-mainText">{c.title}</h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Priority badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.priority === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : c.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {c.priority} Priority
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        c.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : c.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>

                {/* Body details */}
                <p className="text-xs text-brand-mainText leading-relaxed">
                  {c.description}
                </p>

                {/* Admin Note callout if present */}
                {c.adminNote && (
                  <div className="bg-brand-bg p-3 rounded-xl border border-brand-accent/20 text-xs space-y-1">
                    <span className="font-bold text-brand-accent flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Administrator Remark:</span>
                    </span>
                    <p className="text-brand-mainText italic">{c.adminNote}</p>
                  </div>
                )}

                {/* Footer metadata & Action button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs text-brand-subText">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-brand-mainText">
                      By: {c.studentName} ({c.hostelName} - Rm {c.roomNumber})
                    </span>
                    <span>Reported: {c.createdAt}</span>
                  </div>

                  <button
                    onClick={() => handleOpenStatusModal(c)}
                    className="bg-brand-primary hover:bg-brand-dark text-white px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-sm transition"
                  >
                    Update Complaint Status
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* MODAL: UPDATE COMPLAINT STATUS */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-brand-border space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h4 className="text-base font-bold text-brand-mainText">Update Complaint Status</h4>
              <button onClick={() => setSelectedComplaint(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-1 bg-brand-bg p-3 rounded-xl">
              <div className="font-bold text-brand-mainText">{selectedComplaint.title}</div>
              <div className="text-brand-subText">
                Student: {selectedComplaint.studentName} • Rm {selectedComplaint.roomNumber}
              </div>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
              
              <div>
                <label className="font-semibold text-brand-mainText block mb-1">Select Status Flow</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetStatus('Pending')}
                    className={`py-2 rounded-xl font-bold border transition ${
                      targetStatus === 'Pending'
                        ? 'bg-amber-100 text-amber-800 border-amber-400'
                        : 'bg-brand-bg text-brand-subText'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetStatus('In Progress')}
                    className={`py-2 rounded-xl font-bold border transition ${
                      targetStatus === 'In Progress'
                        ? 'bg-blue-100 text-blue-800 border-blue-400'
                        : 'bg-brand-bg text-brand-subText'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetStatus('Resolved')}
                    className={`py-2 rounded-xl font-bold border transition ${
                      targetStatus === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                        : 'bg-brand-bg text-brand-subText'
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-brand-mainText block mb-1">
                  Resolution Note / Warden Remark
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Electrician sent to repair wiring..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg focus:outline-none focus:border-brand-accent text-brand-mainText"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 rounded-xl text-brand-subText hover:bg-brand-bg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-accent hover:bg-brand-accentHover text-white rounded-xl font-bold shadow-sm"
                >
                  Save Status Update
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
