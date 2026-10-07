import React, { useState } from 'react';
import { useHostel } from '../context/HostelContext';
import type { FeeRecord } from '../types';
import {
  CreditCard,
  Plus,
  Search,
  X,
  Check
} from 'lucide-react';

export const FeeManagement: React.FC = () => {
  const { fees, students, addFee, recordPayment } = useHostel();

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFeeForPay, setSelectedFeeForPay] = useState<FeeRecord | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const [formData, setFormData] = useState({
    studentId: students[0]?.studentId || '',
    feeType: 'Full Package' as 'Rent' | 'Mess' | 'Security' | 'Full Package',
    totalAmount: 30000,
    paidAmount: 0,
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
  });

  const filteredFees = fees.filter(fee => {
    const matchesStatus = statusFilter === 'All' || fee.status === statusFilter;
    const matchesSearch =
      fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Financial Metrics
  const totalBilled = fees.reduce((acc, f) => acc + f.totalAmount, 0);
  const totalCollected = fees.reduce((acc, f) => acc + f.paidAmount, 0);
  const totalPending = fees.reduce((acc, f) => acc + f.pendingAmount, 0);

  const handleOpenAdd = () => {
    setFormData({
      studentId: students[0]?.studentId || '',
      feeType: 'Full Package',
      totalAmount: 30000,
      paidAmount: 0,
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.studentId === formData.studentId || s.id === formData.studentId);
    if (!student) return;

    addFee({
      studentId: student.studentId,
      studentName: student.name,
      roomNumber: student.roomNumber || 'N/A',
      feeType: formData.feeType,
      totalAmount: Number(formData.totalAmount),
      paidAmount: Number(formData.paidAmount),
      dueDate: formData.dueDate
    });

    setIsAddModalOpen(false);
  };

  const handleOpenPayment = (fee: FeeRecord) => {
    setSelectedFeeForPay(fee);
    setPaymentAmount(fee.pendingAmount);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeeForPay || paymentAmount <= 0) return;

    recordPayment(selectedFeeForPay.id, Number(paymentAmount));
    setSelectedFeeForPay(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-brand-mainText flex items-center space-x-2">
            <CreditCard className="w-6 h-6 text-brand-accent" />
            <span>Hostel Fee Management</span>
          </h2>
          <p className="text-xs text-brand-subText mt-1">
            Track student fee ledgers, record partial or full payments, and monitor due dates.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-brand-accent hover:bg-brand-accentHover text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Fee Record</span>
        </button>
      </div>

      {/* Financial Summary Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm">
          <span className="text-xs font-semibold text-brand-subText uppercase">Total Invoiced</span>
          <h3 className="text-2xl font-black text-brand-mainText mt-1">₹{totalBilled.toLocaleString()}</h3>
          <p className="text-[11px] text-brand-subText mt-1">Across all fee invoices</p>
        </div>
        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 text-emerald-900 shadow-sm">
          <span className="text-xs font-semibold text-emerald-800 uppercase">Total Collected</span>
          <h3 className="text-2xl font-black text-emerald-700 mt-1">₹{totalCollected.toLocaleString()}</h3>
          <p className="text-[11px] text-emerald-800 mt-1">Received in account</p>
        </div>
        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 text-amber-900 shadow-sm">
          <span className="text-xs font-semibold text-amber-800 uppercase">Total Outstanding</span>
          <h3 className="text-2xl font-black text-brand-warning mt-1">₹{totalPending.toLocaleString()}</h3>
          <p className="text-[11px] text-amber-800 mt-1">Pending student collections</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-sm flex flex-wrap items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-brand-subText absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student name, ID or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-brand-bg rounded-xl border border-brand-border focus:outline-none focus:border-brand-accent text-brand-mainText"
          />
        </div>

        {/* Status Filter Pill */}
        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-brand-bg px-3 py-2 rounded-xl border border-brand-border text-brand-mainText"
          >
            <option value="All">All Payment Statuses</option>
            <option value="Paid">Paid In Full</option>
            <option value="Partial">Partially Paid</option>
            <option value="Pending">Pending Payment</option>
          </select>
        </div>

      </div>

      {/* Fee Records Table */}
      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-bg/80 border-b border-brand-border text-[11px] font-bold text-brand-subText uppercase tracking-wider">
                <th className="py-3 px-4">Student & Room</th>
                <th className="py-3 px-4">Fee Category</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Paid / Pending</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-xs">
              {filteredFees.map((fee) => (
                <tr key={fee.id} className="hover:bg-brand-bg/50 transition">
                  
                  {/* Student */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-brand-mainText">{fee.studentName}</div>
                    <div className="text-[11px] text-brand-subText">{fee.studentId} • Room {fee.roomNumber}</div>
                  </td>

                  {/* Fee Type */}
                  <td className="py-3 px-4">
                    <span className="bg-brand-bg px-2.5 py-1 rounded-lg border border-brand-border font-semibold text-brand-mainText">
                      {fee.feeType}
                    </span>
                  </td>

                  {/* Total */}
                  <td className="py-3 px-4 font-bold text-brand-mainText">
                    ₹{fee.totalAmount.toLocaleString()}
                  </td>

                  {/* Paid / Pending */}
                  <td className="py-3 px-4">
                    <div className="text-emerald-700 font-semibold">Paid: ₹{fee.paidAmount.toLocaleString()}</div>
                    {fee.pendingAmount > 0 && (
                      <div className="text-amber-700 font-semibold">Pending: ₹{fee.pendingAmount.toLocaleString()}</div>
                    )}
                  </td>

                  {/* Due Date */}
                  <td className="py-3 px-4 text-brand-subText">
                    {fee.dueDate}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        fee.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : fee.status === 'Partial'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      {fee.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    {fee.pendingAmount > 0 ? (
                      <button
                        onClick={() => handleOpenPayment(fee)}
                        className="bg-brand-accent hover:bg-brand-accentHover text-white px-3 py-1.5 rounded-lg font-bold text-[11px] transition shadow-sm"
                      >
                        Record Payment
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-end space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Cleared</span>
                      </span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD FEE RECORD */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-brand-border">
            <div className="flex items-center justify-between border-b border-brand-border pb-3 mb-4">
              <h3 className="text-lg font-bold text-brand-mainText flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-brand-accent" />
                <span>Add New Fee Record</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-3 text-xs">
              
              <div>
                <label className="font-semibold text-brand-mainText block mb-1">Select Student</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Fee Type</label>
                  <select
                    value={formData.feeType}
                    onChange={(e) => setFormData({ ...formData, feeType: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg text-brand-mainText"
                  >
                    <option value="Full Package">Full Package</option>
                    <option value="Rent">Hostel Rent</option>
                    <option value="Mess">Mess Fee</option>
                    <option value="Security">Security Deposit</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Total Fee Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Advance Paid Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.paidAmount}
                    onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg font-bold text-emerald-700"
                  />
                </div>
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
                  Create Fee Record
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD PAYMENT */}
      {selectedFeeForPay && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-brand-border space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-brand-border pb-2">
              <h4 className="text-base font-bold text-brand-mainText">Record Fee Payment</h4>
              <button onClick={() => setSelectedFeeForPay(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-brand-bg p-3 rounded-xl space-y-1">
              <div className="font-bold text-brand-mainText">{selectedFeeForPay.studentName}</div>
              <div className="text-brand-subText">{selectedFeeForPay.studentId} • Room {selectedFeeForPay.roomNumber}</div>
              <div className="text-rose-700 font-bold mt-1">
                Outstanding Balance: ₹{selectedFeeForPay.pendingAmount.toLocaleString()}
              </div>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-3">
              <div>
                <label className="font-semibold text-brand-mainText block mb-1">Enter Payment Received Amount (₹)</label>
                <input
                  type="number"
                  required
                  max={selectedFeeForPay.pendingAmount}
                  min={1}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-brand-border bg-white font-black text-base text-emerald-700 focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedFeeForPay(null)}
                  className="px-4 py-2 rounded-xl text-brand-subText hover:bg-brand-bg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-sm"
                >
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
