import React, { useState } from 'react';
import { useHostel } from '../context/HostelContext';
import type { Room } from '../types';
import {
  BedDouble,
  Plus,
  Search,
  AlertCircle,
  Edit2,
  Trash2,
  X
} from 'lucide-react';

export const RoomManagement: React.FC = () => {
  const { rooms, hostels, addRoom, updateRoom, deleteRoom } = useHostel();

  const [selectedHostelFilter, setSelectedHostelFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmRoom, setDeleteConfirmRoom] = useState<Room | null>(null);

  const [formData, setFormData] = useState({
    hostelId: hostels[0]?.id || '',
    roomNumber: '',
    floor: 1,
    type: 'Double' as 'Single' | 'Double' | 'Triple',
    capacity: 2,
    rentPerMonth: 4500,
    status: 'Available' as 'Available' | 'Full' | 'Maintenance'
  });

  const filteredRooms = rooms.filter(room => {
    const matchesHostel = selectedHostelFilter === 'All' || room.hostelId === selectedHostelFilter;
    const matchesStatus = statusFilter === 'All' || room.status === statusFilter;
    const matchesSearch =
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.hostelName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesHostel && matchesStatus && matchesSearch;
  });

  const totalRooms = filteredRooms.length;
  const availableRoomsCount = filteredRooms.filter(r => r.status === 'Available').length;
  const fullRoomsCount = filteredRooms.filter(r => r.status === 'Full').length;
  const maintenanceRoomsCount = filteredRooms.filter(r => r.status === 'Maintenance').length;

  const handleOpenAdd = () => {
    setFormData({
      hostelId: hostels[0]?.id || '',
      roomNumber: `${101 + rooms.length}`,
      floor: 1,
      type: 'Double',
      capacity: 2,
      rentPerMonth: 4500,
      status: 'Available'
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const hostel = hostels.find(h => h.id === formData.hostelId);
    if (!hostel || !formData.roomNumber) return;

    let cap = Number(formData.capacity);
    if (formData.type === 'Single') cap = 1;
    if (formData.type === 'Double') cap = 2;
    if (formData.type === 'Triple') cap = 3;

    addRoom({
      hostelId: hostel.id,
      hostelName: hostel.name,
      roomNumber: formData.roomNumber,
      floor: Number(formData.floor),
      type: formData.type,
      capacity: cap,
      rentPerMonth: Number(formData.rentPerMonth)
    });

    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (room: Room) => {
    setSelectedRoom(room);
    setFormData({
      hostelId: room.hostelId,
      roomNumber: room.roomNumber,
      floor: room.floor,
      type: room.type,
      capacity: room.capacity,
      rentPerMonth: room.rentPerMonth,
      status: room.status
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    updateRoom(selectedRoom.id, {
      type: formData.type,
      capacity: Number(formData.capacity),
      rentPerMonth: Number(formData.rentPerMonth),
      status: formData.status
    });

    setIsEditModalOpen(false);
    setSelectedRoom(null);
  };

  const handleDelete = (room: Room) => {
    deleteRoom(room.id);
    setDeleteConfirmRoom(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-brand-mainText flex items-center space-x-2">
            <BedDouble className="w-6 h-6 text-brand-accent" />
            <span>Room Management & Occupancy Tracker</span>
          </h2>
          <p className="text-xs text-brand-subText mt-1">
            Check room availability, capacity limits, monthly rent tariffs, and maintenance statuses.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-brand-accent hover:bg-brand-accentHover text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Room</span>
        </button>
      </div>

      {/* Quick Occupancy Summary Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-brand-border text-center shadow-sm">
          <span className="text-xs font-semibold text-brand-subText block">Total Rooms</span>
          <span className="text-2xl font-extrabold text-brand-mainText">{totalRooms}</span>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center">
          <span className="text-xs font-semibold text-emerald-800 block">Available Rooms</span>
          <span className="text-2xl font-extrabold text-emerald-700">{availableRoomsCount}</span>
        </div>
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-center">
          <span className="text-xs font-semibold text-rose-800 block">Full Capacity Rooms</span>
          <span className="text-2xl font-extrabold text-rose-700">{fullRoomsCount}</span>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center">
          <span className="text-xs font-semibold text-amber-800 block">Under Maintenance</span>
          <span className="text-2xl font-extrabold text-amber-700">{maintenanceRoomsCount}</span>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-sm flex flex-wrap items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-brand-subText absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by room number or hostel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-brand-bg rounded-xl border border-brand-border focus:outline-none focus:border-brand-accent text-brand-mainText"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          
          <select
            value={selectedHostelFilter}
            onChange={(e) => setSelectedHostelFilter(e.target.value)}
            className="text-xs bg-brand-bg px-3 py-2 rounded-xl border border-brand-border text-brand-mainText"
          >
            <option value="All">All Hostels</option>
            {hostels.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-brand-bg px-3 py-2 rounded-xl border border-brand-border text-brand-mainText"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Full">Full</option>
            <option value="Maintenance">Maintenance</option>
          </select>

        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredRooms.map((room) => {
          const isFull = room.currentOccupancy >= room.capacity;
          const isMaintenance = room.status === 'Maintenance';

          return (
            <div
              key={room.id}
              className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="space-y-3">
                
                {/* Room Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-9 h-9 rounded-xl bg-brand-primary text-white font-black text-sm flex items-center justify-center">
                      {room.roomNumber}
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-subText block font-medium">Floor {room.floor}</span>
                      <span className="text-xs font-bold text-brand-mainText block truncate max-w-[120px]">
                        {room.hostelName}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isMaintenance
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : isFull
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    {room.status}
                  </span>
                </div>

                {/* Details */}
                <div className="bg-brand-bg p-2.5 rounded-xl border border-brand-border/60 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-brand-subText">Room Type:</span>
                    <span className="font-semibold text-brand-mainText">{room.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-subText">Occupancy:</span>
                    <span className="font-bold text-brand-accent">
                      {room.currentOccupancy} / {room.capacity} Beds
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-subText">Monthly Rent:</span>
                    <span className="font-bold text-brand-mainText">₹{room.rentPerMonth.toLocaleString()}</span>
                  </div>
                </div>

              </div>

              {/* Action buttons */}
              <div className="border-t border-brand-border pt-3 mt-3 flex items-center justify-between">
                <button
                  onClick={() => handleOpenEdit(room)}
                  className="text-xs text-brand-subText hover:text-brand-accent flex items-center space-x-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeleteConfirmRoom(room)}
                  className="text-xs text-rose-600 hover:text-rose-700 flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL: ADD / EDIT ROOM */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-brand-border">
            <div className="flex items-center justify-between border-b border-brand-border pb-3 mb-4">
              <h3 className="text-lg font-bold text-brand-mainText flex items-center space-x-2">
                <BedDouble className="w-5 h-5 text-brand-accent" />
                <span>{isAddModalOpen ? 'Add New Room' : 'Edit Room Settings'}</span>
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
              
              {isAddModalOpen && (
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Select Hostel Block</label>
                  <select
                    value={formData.hostelId}
                    onChange={(e) => setFormData({ ...formData, hostelId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                  >
                    {hostels.map(h => (
                      <option key={h.id} value={h.id}>{h.name} ({h.code})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Room Number</label>
                  <input
                    type="text"
                    required
                    placeholder="101"
                    disabled={isEditModalOpen}
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Floor Number</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Room Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      const t = e.target.value as any;
                      let cap = 2;
                      if (t === 'Single') cap = 1;
                      if (t === 'Double') cap = 2;
                      if (t === 'Triple') cap = 3;
                      setFormData({ ...formData, type: t, capacity: cap });
                    }}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                  >
                    <option value="Single">Single Bed</option>
                    <option value="Double">Double Sharing</option>
                    <option value="Triple">Triple Sharing</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.rentPerMonth}
                    onChange={(e) => setFormData({ ...formData, rentPerMonth: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                  />
                </div>
              </div>

              {isEditModalOpen && (
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Room Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                  >
                    <option value="Available">Available</option>
                    <option value="Full">Full</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              )}

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
                  {isAddModalOpen ? 'Create Room' : 'Update Room'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteConfirmRoom && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-brand-border text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-brand-mainText">Delete Room Record?</h4>
              <p className="text-xs text-brand-subText mt-1">
                Are you sure you want to remove Room <strong>{deleteConfirmRoom.roomNumber}</strong> in {deleteConfirmRoom.hostelName}?
              </p>
            </div>
            <div className="flex justify-center space-x-3 text-xs">
              <button
                onClick={() => setDeleteConfirmRoom(null)}
                className="px-4 py-2 rounded-xl border border-brand-border text-brand-subText font-semibold hover:bg-brand-bg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmRoom)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-sm"
              >
                Delete Room
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
