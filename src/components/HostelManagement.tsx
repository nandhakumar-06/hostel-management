import React, { useState } from 'react';
import { useHostel } from '../context/HostelContext';
import type { Hostel } from '../types';
import {
  Building,
  Plus,
  Edit2,
  Trash2,
  Users,
  BedDouble,
  Phone,
  X,
  AlertTriangle
} from 'lucide-react';

export const HostelManagement: React.FC = () => {
  const { hostels, addHostel, updateHostel, deleteHostel } = useHostel();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmHostel, setDeleteConfirmHostel] = useState<Hostel | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Boys' as 'Boys' | 'Girls' | 'Co-ed',
    totalRooms: 30,
    totalCapacity: 60,
    wardenName: '',
    wardenPhone: '',
    amenities: 'Wi-Fi 6, 24/7 Security, Laundry'
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      code: `BLK-${String.fromCharCode(65 + hostels.length)}`,
      type: 'Boys',
      totalRooms: 30,
      totalCapacity: 60,
      wardenName: '',
      wardenPhone: '',
      amenities: 'Wi-Fi 6, 24/7 Security, Study Lounge'
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.wardenName) return;

    addHostel({
      name: formData.name,
      code: formData.code,
      type: formData.type,
      totalRooms: Number(formData.totalRooms),
      totalCapacity: Number(formData.totalCapacity),
      wardenName: formData.wardenName,
      wardenPhone: formData.wardenPhone,
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean)
    });

    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (hostel: Hostel) => {
    setSelectedHostel(hostel);
    setFormData({
      name: hostel.name,
      code: hostel.code,
      type: hostel.type,
      totalRooms: hostel.totalRooms,
      totalCapacity: hostel.totalCapacity,
      wardenName: hostel.wardenName,
      wardenPhone: hostel.wardenPhone,
      amenities: hostel.amenities.join(', ')
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHostel) return;

    updateHostel(selectedHostel.id, {
      name: formData.name,
      code: formData.code,
      type: formData.type,
      totalRooms: Number(formData.totalRooms),
      totalCapacity: Number(formData.totalCapacity),
      wardenName: formData.wardenName,
      wardenPhone: formData.wardenPhone,
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean)
    });

    setIsEditModalOpen(false);
    setSelectedHostel(null);
  };

  const handleDelete = (hostel: Hostel) => {
    deleteHostel(hostel.id);
    setDeleteConfirmHostel(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-brand-mainText flex items-center space-x-2">
            <Building className="w-6 h-6 text-brand-accent" />
            <span>Hostel Management</span>
          </h2>
          <p className="text-xs text-brand-subText mt-1">
            Create and manage hostel blocks, capacity limits, warden assignments, and facilities.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-brand-accent hover:bg-brand-accentHover text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Hostel</span>
        </button>
      </div>

      {/* Hostel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hostels.map((hostel) => {
          const pct = hostel.totalCapacity > 0 ? Math.round((hostel.occupiedBeds / hostel.totalCapacity) * 100) : 0;

          return (
            <div
              key={hostel.id}
              className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="p-5 space-y-4">
                
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase bg-brand-primary text-white px-2 py-0.5 rounded">
                      {hostel.code}
                    </span>
                    <h3 className="text-lg font-extrabold text-brand-mainText mt-1">{hostel.name}</h3>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      hostel.type === 'Boys'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : hostel.type === 'Girls'
                        ? 'bg-pink-50 text-pink-700 border-pink-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}
                  >
                    {hostel.type} Residence
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 bg-brand-bg p-3 rounded-xl border border-brand-border/60">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-brand-subText">Beds Occupancy</span>
                    <span className="text-brand-mainText font-bold">
                      {hostel.occupiedBeds} / {hostel.totalCapacity} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        pct > 90 ? 'bg-rose-500' : 'bg-brand-accent'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-2 text-brand-mainText">
                    <BedDouble className="w-4 h-4 text-brand-accent" />
                    <span><strong>{hostel.totalRooms}</strong> Total Rooms</span>
                  </div>
                  <div className="flex items-center space-x-2 text-brand-mainText">
                    <Users className="w-4 h-4 text-brand-accent" />
                    <span><strong>{hostel.totalCapacity - hostel.occupiedBeds}</strong> Vacant Beds</span>
                  </div>
                </div>

                {/* Warden Info */}
                <div className="border-t border-brand-border/60 pt-3 text-xs space-y-1">
                  <div className="text-[11px] font-semibold text-brand-subText uppercase">Hostel Warden</div>
                  <div className="font-bold text-brand-mainText">{hostel.wardenName}</div>
                  <div className="flex items-center space-x-1.5 text-brand-subText">
                    <Phone className="w-3 h-3 text-brand-accent" />
                    <span>{hostel.wardenPhone}</span>
                  </div>
                </div>

                {/* Amenities pills */}
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-brand-subText uppercase">Facilities</div>
                  <div className="flex flex-wrap gap-1">
                    {hostel.amenities.map((item, idx) => (
                      <span key={idx} className="text-[10px] bg-brand-bg px-2 py-0.5 rounded-md border border-brand-border text-brand-mainText font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="bg-brand-bg/60 border-t border-brand-border p-3 flex items-center justify-between">
                <button
                  onClick={() => handleOpenEdit(hostel)}
                  className="text-xs font-semibold text-brand-subText hover:text-brand-accent flex items-center space-x-1 px-3 py-1.5 rounded-lg hover:bg-white transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Hostel</span>
                </button>
                <button
                  onClick={() => setDeleteConfirmHostel(hostel)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center space-x-1 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL: ADD / EDIT HOSTEL */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-brand-border">
            <div className="flex items-center justify-between border-b border-brand-border pb-3 mb-4">
              <h3 className="text-lg font-bold text-brand-mainText flex items-center space-x-2">
                <Building className="w-5 h-5 text-brand-accent" />
                <span>{isAddModalOpen ? 'Add New Hostel Block' : 'Edit Hostel Block'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit} className="space-y-3 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Hostel Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. North Star"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Block Code</label>
                  <input
                    type="text"
                    required
                    placeholder="BLK-A"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                  >
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                    <option value="Co-ed">Co-ed</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Total Rooms</label>
                  <input
                    type="number"
                    required
                    value={formData.totalRooms}
                    onChange={(e) => setFormData({ ...formData, totalRooms: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Total Capacity</label>
                  <input
                    type="number"
                    required
                    value={formData.totalCapacity}
                    onChange={(e) => setFormData({ ...formData, totalCapacity: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Warden Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Rajesh Verma"
                    value={formData.wardenName}
                    onChange={(e) => setFormData({ ...formData, wardenName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Warden Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.wardenPhone}
                    onChange={(e) => setFormData({ ...formData, wardenPhone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-brand-mainText block mb-1">Amenities (comma-separated)</label>
                <input
                  type="text"
                  placeholder="Wi-Fi, 24/7 Security, Gym, Laundry"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl text-brand-subText hover:bg-brand-bg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-accent hover:bg-brand-accentHover text-white rounded-xl font-bold shadow-sm"
                >
                  {isAddModalOpen ? 'Create Hostel' : 'Update Hostel'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteConfirmHostel && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-brand-border text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-brand-mainText">Delete Hostel Block?</h4>
              <p className="text-xs text-brand-subText mt-1">
                Are you sure you want to delete <strong>{deleteConfirmHostel.name}</strong>? All associated room records will also be removed.
              </p>
            </div>
            <div className="flex justify-center space-x-3 text-xs">
              <button
                onClick={() => setDeleteConfirmHostel(null)}
                className="px-4 py-2 rounded-xl border border-brand-border text-brand-subText font-semibold hover:bg-brand-bg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmHostel)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-sm"
              >
                Delete Hostel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
