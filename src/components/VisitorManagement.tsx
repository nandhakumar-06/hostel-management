import React, { useState } from 'react';
import { useHostel } from '../context/HostelContext';
import {
  UserCheck,
  Plus,
  Search,
  Clock,
  LogOut,
  X
} from 'lucide-react';

export const VisitorManagement: React.FC = () => {
  const { visitors, students, addVisitor, checkoutVisitor } = useHostel();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    visitorName: '',
    phone: '',
    relation: 'Parent',
    studentId: students[0]?.studentId || '',
    purpose: 'Visiting student'
  });

  const filteredVisitors = visitors.filter(v => {
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    const matchesSearch =
      v.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.phone.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const activeCount = visitors.filter(v => v.status === 'In Campus').length;

  const handleOpenAdd = () => {
    setFormData({
      visitorName: '',
      phone: '',
      relation: 'Parent',
      studentId: students[0]?.studentId || '',
      purpose: 'Visiting student'
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.studentId === formData.studentId || s.id === formData.studentId);
    if (!student || !formData.visitorName) return;

    addVisitor({
      visitorName: formData.visitorName,
      phone: formData.phone,
      relation: formData.relation,
      studentId: student.studentId,
      studentName: student.name,
      purpose: formData.purpose
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-brand-mainText flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-brand-accent" />
            <span>Hostel Visitor Log & Entry Management</span>
          </h2>
          <p className="text-xs text-brand-subText mt-1">
            Register visitor entries, link with hostel residents, log exit timestamps, and maintain security logs.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-brand-accent hover:bg-brand-accentHover text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Visitor Entry</span>
        </button>
      </div>

      {/* Campus Active Stat Banner */}
      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between text-emerald-900 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            {activeCount}
          </div>
          <div>
            <h4 className="text-sm font-bold">Currently in Campus</h4>
            <p className="text-xs text-emerald-700">Active visitors logged in hostel premises</p>
          </div>
        </div>
      </div>

      {/* Toolbar Filter */}
      <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-sm flex flex-wrap items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-brand-subText absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search visitor name, resident student or contact number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-brand-bg rounded-xl border border-brand-border focus:outline-none focus:border-brand-accent text-brand-mainText"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs bg-brand-bg px-3 py-2 rounded-xl border border-brand-border text-brand-mainText"
        >
          <option value="All">All Visitor Records</option>
          <option value="In Campus">In Campus</option>
          <option value="Checked Out">Checked Out</option>
        </select>

      </div>

      {/* Visitors Table */}
      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-bg/80 border-b border-brand-border text-[11px] font-bold text-brand-subText uppercase tracking-wider">
                <th className="py-3 px-4">Visitor Information</th>
                <th className="py-3 px-4">Student Associated</th>
                <th className="py-3 px-4">Purpose of Visit</th>
                <th className="py-3 px-4">Entry / Exit Timestamps</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-xs">
              {filteredVisitors.map((v) => (
                <tr key={v.id} className="hover:bg-brand-bg/50 transition">
                  
                  {/* Visitor */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-brand-mainText">{v.visitorName}</div>
                    <div className="text-[11px] text-brand-subText">
                      Relation: {v.relation} • {v.phone}
                    </div>
                  </td>

                  {/* Student */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-brand-mainText">{v.studentName}</div>
                    <div className="text-[11px] text-brand-subText">{v.studentId}</div>
                  </td>

                  {/* Purpose */}
                  <td className="py-3 px-4 text-brand-mainText">
                    {v.purpose}
                  </td>

                  {/* Timestamps */}
                  <td className="py-3 px-4">
                    <div className="text-emerald-700 font-semibold flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>In: {v.entryTime}</span>
                    </div>
                    {v.exitTime && (
                      <div className="text-rose-700 font-semibold flex items-center space-x-1">
                        <LogOut className="w-3 h-3" />
                        <span>Out: {v.exitTime}</span>
                      </div>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        v.status === 'In Campus'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    {v.status === 'In Campus' ? (
                      <button
                        onClick={() => checkoutVisitor(v.id)}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] transition shadow-sm flex items-center space-x-1 ml-auto"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Check Out</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-brand-subText">Completed</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD VISITOR */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-brand-border space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="text-lg font-bold text-brand-mainText flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-brand-accent" />
                <span>Log New Visitor Entry</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-3 text-xs">
              
              <div>
                <label className="font-semibold text-brand-mainText block mb-1">Visitor Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={formData.visitorName}
                  onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Relation</label>
                  <input
                    type="text"
                    required
                    placeholder="Father, Mother, Sibling"
                    value={formData.relation}
                    onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-brand-mainText block mb-1">Hostel Student Being Visited</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg text-brand-mainText"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.studentId}>
                      {s.name} ({s.studentId}) • Rm {s.roomNumber || 'N/A'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-brand-mainText block mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delivering books and personal belongings"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-brand-subText hover:bg-brand-bg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-accent hover:bg-brand-accentHover text-white rounded-xl font-bold shadow-sm"
                >
                  Log Entry
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
